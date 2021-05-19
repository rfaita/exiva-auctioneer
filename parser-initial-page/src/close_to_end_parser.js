const Crawler = require('crawler');
const { DateTime } = require('luxon');

const crawler = new Crawler({
    maxConnections: 1,
    headers: {
        'authority': 'www.tibia.com',
        'pragma': 'no-cache',
        'cache-control': 'no-cache',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        'referer': 'https://www.tibia.com/charactertrade/',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': 'CookieConsentPreferences={"consent":true,"advertising":true,"socialmedia":true}; CookieConsentPreferences={"consent":true,"advertising":true,"socialmedia":true}; __cfduid=de527064063d79cfaa42d09ac1eb6f7c11614689078; DM_Referer=https%3A%2F%2Fwww.google.com%2F; cf_clearance=6d4c73d23c644acd6d66ccb868c096a3405e42e5-1614696883-0-150; useauthenticator=1; SecureSessionID=MOG03WRpzG2t1kfLurAjpNyNueqv2T; SessionLastVisit=1614697684; DM_LandingPage=visited'
    }
});

function loadUrl(url) {
    return new Promise((resolve, reject) => {
        crawler.queue([{
            uri: url,

            callback: (error, res, done) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(res.$);
                }
                done();
            }
        }]);
    });
}


const extractCloseToEndAuctions = async function (timeToEnd = 10000, currentPage = 1, maxPages = 1000) {
    const url = `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&filter_profession=0&filter_levelrangefrom=0&filter_levelrangeto=0&filter_world=&filter_worldpvptype=9&filter_worldbattleyestate=0&filter_skillid=&filter_skillrangefrom=0&filter_skillrangeto=0&order_column=101&order_direction=1&searchtype=1&currentpage=${currentPage}`;


    console.log(`  parsing close to end auctions, currentPage ${currentPage}`);

    const html = await loadUrl(url);

    const len = html('.Auction .AuctionCharacterName a').length;

    let ret = [];

    for (let index = 0; index < len; index++) {

        const now = DateTime.local().toMillis();

        const auctionEl = html('.Auction').eq(index);

        const auction = {
            startDate: parseDate(auctionEl.find('.ShortAuctionDataValue').eq(0).text()),
            endDate: parseDate(auctionEl.find('.ShortAuctionDataValue').eq(1).text()),
            hasBid: auctionEl.find('.ShortAuctionDataLabel').eq(2).text().indexOf("Minimum") <= -1,
            value: parseInt(auctionEl.find('.ShortAuctionDataValue b').text().replace(/[^\d]/g, '')),
            status: !!auctionEl.find('.AuctionInfo span').text() ? auctionEl.find('.AuctionInfo span').text() : auctionEl.find('.AuctionInfo').text()
        }
        auction.status = !auction.status ? "ongoing" : auction.status;

        if (['finished', 'ongoing', 'cancelled'].indexOf(auction.status) <= -1) {
            auction.status = 'finished';
        }


        if ((auction.endDate - now) <= timeToEnd) {
            ret.push({ auctionId: /auctionid=(\d+)/.exec(html('.AuctionCharacterName a').eq(index).attr('href'))[1], ...auction });
        }
    }

    if (ret.length === 25 && currentPage < maxPages) {
        ret = [...ret, ...(await extractCloseToEndAuctions(timeToEnd, (currentPage + 1), maxPages))];
    }

    return ret;
}


function parseDate(str) {

    const parse = str.replace(/\s/g, '-').replace(/-CE(S)?T/, '');

    let ret;

    if (str.indexOf('CEST') > -1) {
        ret = DateTime.fromFormat(parse, 'MMM-dd-yyyy,-HH:mm', { setZone: true, zone: 'UTC+2' }).toMillis();
    } else {
        ret = DateTime.fromFormat(parse, 'MMM-dd-yyyy,-HH:mm', { setZone: true, zone: 'UTC+1' }).toMillis();
    }

    if (isNaN(ret)) {
        if (str.indexOf('CEST') > -1) {
            ret = DateTime.fromFormat(parse, 'MMM-dd-yyyy,-HH:mm:ss', { setZone: true, zone: 'UTC+2' }).toMillis();
        } else {
            ret = DateTime.fromFormat(parse, 'MMM-dd-yyyy,-HH:mm:ss', { setZone: true, zone: 'UTC+1' }).toMillis();
        }
    }

    return ret;
}

exports.extractCloseToEndAuctions = extractCloseToEndAuctions;