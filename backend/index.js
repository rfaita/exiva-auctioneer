const express = require('express');
const compression = require('compression');
const http = require('http');
const path = require('path');
const cors = require('cors');

const mongoose = require('mongoose');

const auction = require('./src/route/auction');
const notification = require('./src/route/notification');

mongoose.set('useFindAndModify', false);

const httpPort = process.env.PORT || '9081';

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

const app = express();

app.use(function (req, res, next) {
    if (['production'].indexOf(process.env.NODE_ENV) >= 0) {
        if (req.headers['x-forwarded-proto'] != 'https') {
            res.redirect(302, 'https://' + req.hostname + req.originalUrl);
        } else {
            next();
        }
    } else {
        next();
    }
});

app.use(cors())
app.use(express.static('public'))

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auction', auction.router);
app.use('/api/notification', notification.router);

app.get('/*', (req, res) => res.sendFile('index.html', { root: 'public' }))

// * Start * //

app.listen(httpPort, () =>
    console.log(` [x] App listening on port ${httpPort}!`),
);