const { extractAuction } = require('./src/auction_parser');
const { CharAuctionModel } = require('./src/model/charAuction');
const { DateTime } = require('luxon');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const mongoFullURL = process.env.MONGO_FULL_URL || '';
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoDb = process.env.MONGO_DB || 'test';
const mongoUser = process.env.MONGO_USER || '';
const mongoPass = encodeURIComponent(process.env.MONGO_PASS || '');

let mongoConnection = '';
if (!!mongoFullURL) {
    mongoConnection = mongoFullURL;
} else if (!!mongoUser) {
    mongoConnection = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDb}?authSource=admin&w=1`;
} else {
    mongoConnection = `mongodb://${mongoHost}/${mongoDb}`;
}

mongoose.connect(mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(' [x] Connected to MongoDB')
});

const amqp = require('amqplib/callback_api');

const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost';
const rabbitmqUser = process.env.RABBITMQ_USER || '';
const rabbitmqPass = encodeURIComponent(process.env.RABBITMQ_PASS || '');

const queueName = process.env.RABBITMQ_QUEUE || 'parse_auction';
const exchangeName = process.env.RABBITMQ_EXCHANGE || 'parse_auction_exchange';

const notificationQueueName = process.env.RABBITMQ_NOT_QUEUE || 'notification';
const notificationExchangeName = process.env.RABBITMQ_NOT_EXCHANGE || 'notification_exchange';

let rabbitMqConnection = '';
if (!!rabbitmqUser) {
    rabbitMqConnection = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}`;
} else {
    rabbitMqConnection = `amqp://${rabbitmqHost}`;
}

let channel;

amqp.connect(rabbitMqConnection, function (error0, connection) {
    if (error0) {
        throw error0;
    }

    console.log(` [x] Connected to RabbitMQ`);
    connection.createChannel(function (error1, c) {
        if (error1) {
            throw error1;
        }

        channel = c;

        createExchangeAndQueue(exchangeName, queueName);
        createExchangeAndQueue(notificationExchangeName, notificationQueueName);

        channel.prefetch(1);
        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queueName);

        startConsumer(exchangeName, queueName);

    });
});


const MINUTE_MILLIS_CONST = 60000;

async function extractAndSaveAuction(message) {

    const _id = '' + message.auctionId;

    if (!!message.status && message.status === 'delete') {
        return deleteAuction(_id);
    } else {
        const currentCharAuctionModel = await CharAuctionModel.findById(_id).exec();

        console.log(`  current action status ${currentCharAuctionModel?.auction?.status}`);

        if (verifyAuctionNotBeParsed(currentCharAuctionModel)) {
            console.log(`  auction ignored: ${_id}`);
            return { _id: message.auctionId, auction: { status: 'ignored' } };
        } else {
            if (!!currentCharAuctionModel && !!currentCharAuctionModel.name) {
                return updateAuction(message, currentCharAuctionModel);
            } else {
                return saveNewAuction(_id);
            }
        }
    }

}

function verifyAuctionNotBeParsed(currentCharAuctionModel) {

    const now = DateTime.local().toMillis();

    return !!currentCharAuctionModel
        && (currentCharAuctionModel.auction.status === 'finished'
            || ((now - currentCharAuctionModel.lastUpdate) <= MINUTE_MILLIS_CONST
                && (currentCharAuctionModel.auction.endDate - now) >= 10 * MINUTE_MILLIS_CONST));
}

async function updateAuction(message, charAuctionModel) {
    let auction;

    const _id = '' + message.auctionId;

    if (!!charAuctionModel.auction) {
        if (!!message.status) {
            auction = { value: message.value, status: message.status, hasBid: message.hasBid };
        } else {
            const charAuction = await extractAuction(_id, false);
            auction = charAuction.auction;
        }


        if (charAuctionModel.auction.value !== auction.value ||
            charAuctionModel.auction.status !== auction.status ||
            charAuctionModel.auction.hasBid !== auction.hasBid) {

            charAuctionModel.lastUpdate = DateTime.now().toMillis();
            charAuctionModel.auction.value = auction.value;
            charAuctionModel.auction.status = auction.status;
            charAuctionModel.auction.hasBid = auction.hasBid;

            console.log(`  updating, new status: ${charAuctionModel.auction.status}, new big : ${charAuctionModel.auction.value}, new hasBid: ${charAuctionModel.auction.hasBid}`);

            sendNotification({ auctionId: _id, auction: charAuctionModel.auction, type: 'NEW_BID' });

            return saveAuction(charAuctionModel);
        } else {

            console.log(`  auction without differences: ${charAuctionModel.id}`);
            return { _id: message.auctionId, auction: { status: 'ignored' } };

        }
    }
}

async function saveNewAuction(_id) {
    const charAuction = await extractAuction(_id, true);

    if (charAuction.auction.status === 'requeue') {
        console.log(`  auction requeued: ${_id}`);

        return charAuction;
    } else {
        const charAuctionModel = new CharAuctionModel(charAuction);
        console.log(`  new auction, status: ${charAuctionModel.auction.status}`);

        sendNotification({ auctionId: _id, auction: charAuctionModel.auction, type: 'NEW_AUCTION' });

        return saveAuction(charAuctionModel);
    }
}

async function deleteAuction(_id) {
    await CharAuctionModel.findByIdAndDelete(_id);

    console.log(`  auction deleted: ${_id}`);

    return { _id: _id, auction: { status: 'deleted' } };
}

async function saveAuction(charAuctionModel) {
    const saved = await CharAuctionModel.findOneAndUpdate({ _id: charAuctionModel._id }, charAuctionModel, { upsert: true, new: true });

    console.log(`  auction saved: ${charAuctionModel._id}`);

    return saved;
}

function sendNotification(message) {
    enqueue(notificationExchangeName, notificationQueueName, JSON.stringify(message));
}

function enqueue(exchange, queue, message) {
    console.log(` [x] Enqueued: ${exchange} -> ${message.toString()}`);
    channel.publish(exchange, queue, new Buffer.from(message));
}



function createExchangeAndQueue(exchangeName, queueName) {
    console.log(` [x] Creating exchange ${exchangeName}`);
    channel.assertExchange(exchangeName, 'x-delayed-message', {
        autoDelete: false,
        durable: true,
        passive: true,
        arguments: {
            'x-delayed-type': 'direct'
        }
    })

    console.log(` [x] Creating queue ${queueName}`);
    channel.assertQueue(queueName, {
        durable: false,
        arguments: {
            'x-max-priority': 100
        }
    });

    console.log(` [x] Binding queue '${queueName}' to '${exchangeName}' with name '${queueName}'`);
    channel.bindQueue(queueName, exchangeName, queueName);
}

function startConsumer(exchangeName, queueName) {

    const consumerTag = `parser-${DateTime.local().toMillis()}`;

    channel.consume(queueName, async (msg) => {
        console.log(` [x] Received: ${msg.content.toString()}`);

        const auction = await extractAndSaveAuction(JSON.parse(msg.content));

        if (auction.auction.status == 'requeue') {
            enqueue(channel, exchangeName, queueName, msg.content);
            channel.cancel(consumerTag);
            rescheduleConsumer(channel, exchangeName, queueName);
            console.log(` [x] I worked too much, I will take a break...`);
        } else {
            console.log(` [x] Done: ${msg.content.toString()}`);
        }

        channel.ack(msg);

    }, { consumerTag: consumerTag });
}

function rescheduleConsumer(exchangeName, queueName) {
    setTimeout(() => {
        console.log(` [x] Let's back to work!!!`);
        startConsumer(channel, exchangeName, queueName);
    }, 15 * MINUTE_MILLIS_CONST)
}