const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    token: String,
    auctionId: String
});

exports.NotificationModel = mongoose.model('notification', notificationSchema);