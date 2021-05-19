const { Router } = require('express');
const { NotificationModel } = require('../model/notification');
const querystring = require('querystring');

const router = Router();

router.post('/:auctionId/:token', async (req, res) => {

    const notification = {
        auctionId: req.params.auctionId,
        token: req.params.token
    }

    const savedNotification = await NotificationModel.create(notification);
    console.log(savedNotification);

    return res.send(savedNotification);
});

router.delete('/:auctionId/:token', async (req, res) => {

    const notification = {
        auctionId: req.params.auctionId,
        token: req.params.token
    }

    await NotificationModel.deleteOne(notification);
    
    return res.send(notification);
});

exports.router = router;