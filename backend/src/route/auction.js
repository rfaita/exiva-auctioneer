const { Router } = require('express');
const { CharAuctionModel } = require('../model/charAuction');
const querystring = require('querystring');

const router = Router();

const sortsType = {
    'endDate': ['auction.endDate'],
    'value': ['auction.value'],
    'valueAndBidded': ['auction.value', 'auction.hasBid'],
    'level': ['level']
}

router.get('/:auctionId', async (req, res) => {

    const auctionId = req.params.auctionId;

    console.log(`findById ${auctionId}`);

    const charAuction = await CharAuctionModel.findById(auctionId).exec();

    return res.send(charAuction);
});

router.get('/', async (req, res) => {


    let query = {};
    let page = 0;
    let size = 20;
    let sortType = 'endDate';

    if (req.url.indexOf("?") > -1) {

        const queryString = querystring.parse(req.url.split('?')[1]);

        console.log(queryString);

        try {
            query = JSON.parse(queryString.query);
            page = parseInt(queryString.page);
            size = parseInt(queryString.size);
            sortType = queryString.sortType || 'endDate';
            sortOrder = queryString.sortOrder || 'asc';
        } catch (e) {
            console.log(e);
            return res.send([]);
        }

    }


    const sortObject = {};
    sortObject[sortsType[sortType][0]] = sortOrder === 'asc' ? 1 : -1;
    if (sortsType[sortType].length > 1) {
        sortObject[sortsType[sortType][1]] = -1;
    }
    sortObject['_id'] = 1;

    console.log(sortObject);

    const charAuctions = await CharAuctionModel
        .find(query,
            '_id name outfit showRoomItems lastUpdate auction level vocation sex server skills charms')
        .sort(sortObject)
        .limit(size)
        .skip(size * page)
        .exec();

    console.log(charAuctions.length);

    return res.send(charAuctions);
});

exports.router = router;