const { DateTime } = require('luxon');
const { NotificationModel } = require('./src/model/notification');
const { admin } = require('./src/firebase-config');

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


const notificationQueueName = process.env.RABBITMQ_NOT_QUEUE || 'notification';
const notificationExchangeName = process.env.RABBITMQ_NOT_EXCHANGE || 'notification_exchange';

let rabbitMqConnection = '';
if (!!rabbitmqUser) {
    rabbitMqConnection = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}`;
} else {
    rabbitMqConnection = `amqp://${rabbitmqHost}`;
}

let channel;

console.log(`rabbitmq connect: ${rabbitMqConnection}`);

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

        createExchangeAndQueue(notificationExchangeName, notificationQueueName);

        channel.prefetch(1);
        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', notificationQueueName);

        startConsumer(notificationExchangeName, notificationQueueName);

    });
});

function createExchangeAndQueue(exchangeName, queueName) {
    console.log(` [x] Creating exchange ${exchangeName}`);
    channel.assertExchange(exchangeName, {
        autoDelete: false,
        durable: true,
        passive: true,
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

    const consumerTag = `notification-${DateTime.local().toMillis()}`;

    channel.consume(queueName, async (msg) => {
        console.log(` [x] Received: ${msg.content.toString()}`);

        const data = JSON.parse(msg.content);

        const now = DateTime.local().toMillis();
        const endDiff = (data.auction.endDate - now) / 1000;

        const endDate = endDiff <= 30 * 60 ? `ending in ${parseInt(endDiff / 60)}m ${parseInt(endDiff % 60)}s` : `ending at ${DateTime.fromMillis(data.auction.endDate).toHTTP()}`;

        const message = {
            data: {
                title: data.type === 'NEW_BID' ? `Auction Updated ${data.auctionId}` : `New Auction ${data.auctionId}`,
                body: data.auction.hasBid ? `Current Bid: ${data.auction.value} ${endDate}` : `Minimum Bid: ${data.auction.value} ${endDate}`,
                auctionId: data.auctionId
            }
        }

        const notifications = await NotificationModel.find({ auctionId: data.auctionId }).exec();

        console.log(notifications);
        for (let i = 0; i < notifications.length; i++) {
            console.log(`  sending notification to ${notifications[i].token}`);
            await admin.messaging().sendToDevice(notifications[i].token, message, {})
        }

            

        channel.ack(msg);

    }, { consumerTag: consumerTag });
}

const express = require('express')
const actuator = require('express-actuator')

const app = express()

app.use(actuator())

app.listen(8080)