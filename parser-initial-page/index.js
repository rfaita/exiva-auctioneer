const { extractCloseToEndAuctions } = require('./src/close_to_end_parser');
const { CharAuctionModel } = require('./src/model/charAuction');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const amqp = require('amqplib/callback_api');

const mongoFullURL = process.env.MONGO_FULL_URL || '';
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoDb = process.env.MONGO_DB || 'test';
const mongoUser = process.env.MONGO_USER || '';
const mongoPass = encodeURIComponent(process.env.MONGO_PASS || '');

const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost';
const rabbitmqUser = process.env.RABBITMQ_USER || '';
const rabbitmqPass = encodeURIComponent(process.env.RABBITMQ_PASS || '');

const queueName = process.env.RABBITMQ_QUEUE || 'parse_auction';
const exchangeName = process.env.RABBITMQ_EXCHANGE || 'parse_auction_exchange'


let mongoConnection = '';
if (!!mongoFullURL) {
    mongoConnection = mongoFullURL;
} else if (!!mongoUser) {
    mongoConnection = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDb}?authSource=admin&w=1`;
} else {
    mongoConnection = `mongodb://${mongoHost}/${mongoDb}`;
}


let rabbitMqConnection = '';
if (!!rabbitmqUser) {
    rabbitMqConnection = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}`;
} else {
    rabbitMqConnection = `amqp://${rabbitmqHost}`;
}

mongoose.connect(mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(' [x] Connected to MongoDB')
});


function queue(channel, exchange, queue, message, priority) {
    if (priority <= 0) {
        channel.publish(exchange, queue, new Buffer.from(message));
    } else {
        channel.publish(exchange, queue, new Buffer.from(message), { priority: priority });
    }

}

amqp.connect(rabbitMqConnection, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        console.log(` [x] Creating exchange ${exchangeName}`);
        channel.assertExchange(exchangeName, "fanout", {
            autoDelete: false,
            durable: true,
            passive: true
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


        const createIntervalParseAuctions = function (options) {

            const intervalFunction = async () => {

                console.log(` [x] Getting close to end auctions ${options.timeToEnd}`);
                const data = await extractCloseToEndAuctions(options.timeToEnd, 1, options.maxPages);

                for (let i = 0; i < data.length; i++) {
                    queue(channel, exchangeName, queueName, JSON.stringify(data[i]), options.priority);
                }

            }

            if (options.runOnStartUp) {
                intervalFunction();
            }
            setInterval(intervalFunction, options.timeToRepeat);
        }

        const createIntervalFinishUnfinishedAuctions = function (timeToRepeat) {

            const intervalFunction = async () => {

                console.log(` [x] Clearing finished auctions`);

                const charAuctions = await CharAuctionModel
                    .deleteMany({ 'auction.endDate': { $lte: new Date().getTime() } })
                    .exec();


            }

            intervalFunction();
            setInterval(intervalFunction, timeToRepeat);

        }


        const SECOND = 1000;
        const MINUTE = 60 * SECOND;
        const HOUR = 60 * MINUTE;
        const DAY = 24 * HOUR;

        createIntervalParseAuctions({
            timeToEnd: 2 * HOUR,
            timeToRepeat: 30 * SECOND,
            priority: 100,
            maxPages: 12,
            runOnStartUp: false
        });
        createIntervalParseAuctions({
            timeToEnd: 4 * HOUR,
            timeToRepeat: 5 * MINUTE,
            priority: 90,
            maxPages: 24,
            runOnStartUp: false
        });
        createIntervalParseAuctions({
            timeToEnd: 8 * HOUR,
            timeToRepeat: 10 * MINUTE,
            priority: 80,
            maxPages: 48,
            runOnStartUp: false
        });
        createIntervalParseAuctions({
            timeToEnd: DAY,
            timeToRepeat: HOUR,
            priority: 70,
            maxPages: 96,
            runOnStartUp: false
        });
        createIntervalParseAuctions({
            timeToEnd: 7 * DAY,
            timeToRepeat: DAY,
            priority: 60,
            maxPages: 192,
            runOnStartUp: true
        });

        createIntervalFinishUnfinishedAuctions(30 * SECOND);


    });
});

const express = require('express')
const actuator = require('express-actuator')

const app = express()

app.use(actuator())

app.listen(8080)


