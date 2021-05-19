const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    _id: String,
    token: String,
    auctionId: String
});

exports.NotificationModel = mongoose.model('notification', notificationSchema);