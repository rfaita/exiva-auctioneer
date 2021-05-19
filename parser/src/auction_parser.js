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

const ajaxTableCrawler = new Crawler({
    maxConnections: 1,
    headers: {
        'authority': ' www.tibia.com',
        'pragma': ' no-cache',
        'cache-control': ' no-cache',
        'accept': ' */*',
        'user-agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
        'x-requested-with': ' XMLHttpRequest',
        'sec-fetch-site': ' same-origin',
        'sec-fetch-mode': ' cors',
        'sec-fetch-dest': ' empty',
        'accept-language': ' pt-BR,pt;q=0.9'
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


function loadAjaxTable(url) {
    return new Promise((resolve, reject) => {
        ajaxTableCrawler.queue([{
            uri: url,

            callback: (error, res, done) => {
                if (error) {
                    reject(error);
                } else {
                    if (res.body.indexOf("You don't have permission to access this resource.") > -1) {
                        reject(new Error('requeue'));
                    } else {
                        ajaxTableCrawler.queue([{
                            html: JSON.parse(res.toJSON().body).AjaxObjects[0].Data,
                            callback: (error, res, done) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(res.$);
                                }
                                done();
                            }
                        }])
                    }

                }
                done();
            }
        }]);
    });
}


exports.extractAuction = async function (id, complete = true) {

    const url = `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${id}`;

    console.log(`  parsing auction: ${id}, complete: ${complete}`);

    const html = await loadUrl(url);

    if (html('p').text() === "You don't have permission to access this resource.") {
        return { _id: '' + id, auction: { status: 'requeue' } };
    }

    if (html('.red').text() === 'An internal error has occurred. Please try again later!') {
        return { _id: '' + id, auction: { status: 'notfound' } };
    }

    const char = { _id: '' + id };

    try {

        char.name = html('.AuctionCharacterName').text();
        char.outfit = html('.AuctionOutfitImage').attr('src');
        char.outfit = !!char.outfit ? char.outfit.replace('https://static.tibia.com/images/charactertrade', '') : '';
        char.showRoomItems = html('.AuctionItemsViewBox .CVIconObject')
            .map((index, el) => {
                const parsedEl = html(el);
                const img = parsedEl.find('img').attr('src');
                return {
                    title: parsedEl.attr('title'),
                    img: !!img ? img.replace('https://static.tibia.com/images/charactertrade', '') : ''
                }
            }).get();
        char.lastUpdate = DateTime.now().toMillis();

        const header = html('.AuctionHeader').text();
        const labels = html('.LabelV');

        char.level = parseInt(/Level:\s(\d*)\s/.exec(header)[1]);
        char.vocation = /Vocation:\s([^|]*)\s/.exec(header)[1];
        char.sex = header.split("|")[2].replace(/\s/g, '');
        char.server = /World:\s(.*)$/.exec(header)[1];
        char.creationDate = parseDate(labels.eq(8).next().text());
        char.experience = parseInt(labels.eq(9).next().text().replace(/[^\d]/g, ''));
        char.gold = parseInt(labels.eq(10).next().text().replace(/[^\d]/g, ''));
        char.achivementPoints = parseInt(labels.eq(11).next().text().replace(/[^\d]/g, ''));
        char.charm = {
            expansion: labels.eq(13).next().text().replace(/\s/g, '') === 'no' ? false : true,
            available: parseInt(labels.eq(14).next().text().replace(/[^\d]/g, '')),
            spent: parseInt(labels.eq(15).next().text().replace(/[^\d]/g, ''))
        }

        char.dailyRewardStrike = parseInt(labels.eq(16).next().text().replace(/[^\d]/g, ''));

        char.huntingTask = {
            points: parseInt(labels.eq(17).next().text().replace(/[^\d]/g, '')),
            taskSlot: parseInt(labels.eq(18).next().text().replace(/[^\d]/g, '')),
            preySlot: parseInt(labels.eq(19).next().text().replace(/[^\d]/g, ''))
        }

        char.hirelings = parseInt(labels.eq(20).next().text().replace(/[^\d]/g, ''));
        char.hirelingsJobs = parseInt(labels.eq(21).next().text().replace(/[^\d]/g, ''));
        char.hirelingsOutfits = parseInt(labels.eq(22).next().text().replace(/[^\d]/g, ''));

        char.auction = {
            startDate: parseDate(html('.ShortAuctionDataValue').eq(0).text()),
            endDate: parseDate(html('.ShortAuctionDataValue').eq(1).text()),
            hasBid: html('.ShortAuctionDataLabel').eq(2).text().indexOf("Minimum") <= -1,
            value: parseInt(html('.ShortAuctionDataValue b').text().replace(/[^\d]/g, '')),
            status: !!html('.AuctionInfo span').text() ? html('.AuctionInfo span').text() : html('.AuctionInfo').text()
        }
        char.auction.status = !char.auction.status ? "ongoing" : char.auction.status;

        if (['finished', 'ongoing', 'cancelled'].indexOf(char.auction.status) <= -1) {
            char.auction.status = 'finished';
        }

        char.status = {
            hp: parseInt(labels.eq(0).next().text().replace(/[^\d]/g, '')),
            mp: parseInt(labels.eq(1).next().text().replace(/[^\d]/g, '')),
            capacity: parseInt(labels.eq(2).next().text().replace(/[^\d]/g, '')),
            speed: parseInt(labels.eq(3).next().text().replace(/[^\d]/g, '')),

        }

        char.skins = {
            blessings: labels.eq(4).next().text(),
            mounts: parseInt(labels.eq(5).next().text().replace(/[^\d]/g, '')),
            outfits: parseInt(labels.eq(6).next().text().replace(/[^\d]/g, '')),
            titles: parseInt(labels.eq(7).next().text().replace(/[^\d]/g, '')),
        }

        const skills = html('.LevelColumn');
        const skillsPerc = html('.PercentageString');

        char.skills = {
            axe: parseInt(skills.eq(0).text().replace(/[^\d]/g, '')),
            axeNL: parseInt(skillsPerc.eq(0).text().replace(/[^\d]/g, '')) / 100,

            club: parseInt(skills.eq(1).text().replace(/[^\d]/g, '')),
            clubNL: parseInt(skillsPerc.eq(1).text().replace(/[^\d]/g, '')) / 100,

            distance: parseInt(skills.eq(2).text().replace(/[^\d]/g, '')),
            distanceNL: parseInt(skillsPerc.eq(2).text().replace(/[^\d]/g, '')) / 100,

            fishing: parseInt(skills.eq(3).text().replace(/[^\d]/g, '')),
            fishingNL: parseInt(skillsPerc.eq(3).text().replace(/[^\d]/g, '')) / 100,

            fist: parseInt(skills.eq(4).text().replace(/[^\d]/g, '')),
            fistNL: parseInt(skillsPerc.eq(4).text().replace(/[^\d]/g, '')) / 100,

            magic: parseInt(skills.eq(5).text().replace(/[^\d]/g, '')),
            magicNL: parseInt(skillsPerc.eq(5).text().replace(/[^\d]/g, '')) / 100,

            shield: parseInt(skills.eq(6).text().replace(/[^\d]/g, '')),
            shieldNL: parseInt(skillsPerc.eq(6).text().replace(/[^\d]/g, '')) / 100,

            sword: parseInt(skills.eq(7).text().replace(/[^\d]/g, '')),
            swordNL: parseInt(skillsPerc.eq(7).text().replace(/[^\d]/g, '')) / 100,
        }

        const blessings = html('.TableContent').eq(18);

        char.blessings = {
            adventurersBlessing: blessings.find('td').eq(2).text() === '1 x',
            bloodOfTheMoutain: blessings.find('td').eq(4).text() === '1 x',
            embraceOfTibia: blessings.find('td').eq(6).text() === '1 x',
            fireOfTheSuns: blessings.find('td').eq(8).text() === '1 x',
            heartOfTheMountain: blessings.find('td').eq(10).text() === '1 x',
            sparkOfThePhoenix: blessings.find('td').eq(12).text() === '1 x',
            spiritualShielding: blessings.find('td').eq(14).text() === '1 x',
            twistOfFate: blessings.find('td').eq(16).text() === '1 x',
            wisdomOfSolitude: blessings.find('td').eq(18).text() === '1 x'
        }

        char.imbuements = [];

        const imbuements = html('.TableContent').eq(19).find('td');

        const moreEntriesI = imbuements.eq(imbuements.length - 1).text().indexOf("more entr") > -1 ? 1 : 0;
        for (let i = 1; i < (imbuements.length - moreEntriesI); i++) {
            char.imbuements.push(imbuements.eq(i).text());
        }

        char.quests = [];
        const quests = html('.TableContent').eq(22).find('td');

        const moreEntriesQ = quests.eq(quests.length - 1).text().indexOf("more entr") > -1 ? 1 : 0;
        for (let i = 1; i < (quests.length - moreEntriesQ); i++) {
            char.quests.push(quests.eq(i).text());
        }

        char.titles = [];
        const titles = html('.TableContent').eq(24).find('td');

        const moreEntriesT = titles.eq(titles.length - 1).text().indexOf("more entr") > -1 ? 1 : 0;
        for (let i = 1; i < (titles.length - moreEntriesT); i++) {
            char.titles.push(titles.eq(i).text());
        }

        char.achivements = [];
        const achivements = html('.TableContent').eq(25).find('td');

        const moreEntriesA = achivements.eq(achivements.length - 1).text().indexOf("more entr") > -1 ? 1 : 0;
        for (let i = 1; i < (achivements.length - moreEntriesA); i++) {
            char.achivements.push(achivements.eq(i).text());
        }

        char.bestiary = [];
        const bestiaries = html('.TableContent').eq(26).find('tr');

        const moreEntriesB = bestiaries.eq(bestiaries.length - 1).text().indexOf("more entr") > -1 ? 1 : 0;
        for (let i = 1; i < (bestiaries.length - moreEntriesB); i++) {
            const bestiary = bestiaries.eq(i).find('td');
            char.bestiary.push({
                step: parseInt(bestiary.eq(0).text().replace(/[^\d]/g, '')),
                kills: parseInt(bestiary.eq(1).text().replace(/[^\d]/g, '')),
                name: bestiary.eq(2).text()
            });
        }


        char.charms = [];
        const charms = html('.TableContent').eq(20).find('tr');

        const moreEntriesC = charms.eq(charms.length - 1).text().indexOf("more entr") > -1 ? 1 : 0;
        for (let i = 1; i < (charms.length - moreEntriesC); i++) {
            const charm = charms.eq(i).find('td');
            char.charms.push({
                value: parseInt(charm.eq(0).text().replace(/[^\d]/g, '')),
                name: charm.eq(1).text()
            });
        }
    } catch (e) {
        console.log(e);
        return { _id: '' + id, auction: { status: 'requeue' } };
    }

    if (complete) {

        try {

            let itemsPage = parseInt(html('.TableContent').eq(11).find('.PageLink').last().text());
            console.log(`  parsing items: ${id}, number of pages ${itemsPage}`);
            char.items = await extractAjaxTable(id, itemsPage, 0, html);

            itemsPage = parseInt(html('.TableContent').eq(12).find('.PageLink').last().text());
            console.log(`  parsing store items: ${id}, number of pages ${itemsPage}`);
            char.storeItems = await extractAjaxTable(id, itemsPage, 1, html);

            itemsPage = parseInt(html('.TableContent').eq(13).find('.PageLink').last().text());
            console.log(`  parsing mounts: ${id}, number of pages ${itemsPage}`);
            char.mounts = await extractAjaxTable(id, itemsPage, 2, html);

            itemsPage = parseInt(html('.TableContent').eq(14).find('.PageLink').last().text());
            console.log(`  parsing store mounts: ${id}, number of pages ${itemsPage}`);
            char.storeMounts = await extractAjaxTable(id, itemsPage, 3, html);

            itemsPage = parseInt(html('.TableContent').eq(15).find('.PageLink').last().text());
            console.log(`  parsing oufits: ${id}, number of pages ${itemsPage}`);
            char.outfits = await extractAjaxTable(id, itemsPage, 4, html);

            itemsPage = parseInt(html('.TableContent').eq(16).find('.PageLink').last().text());
            console.log(`  parsing store oufits: ${id}, number of pages ${itemsPage}`);
            char.storeOutfits = await extractAjaxTable(id, itemsPage, 5, html);

            itemsPage = parseInt(html('.TableContent').eq(17).find('.PageLink').last().text());
            console.log(`  parsing familiars: ${id}, number of pages ${itemsPage}`);
            char.familiars = await extractAjaxTable(id, itemsPage, 6, html);

        } catch (e) {
            return { _id: '' + id, auction: { status: 'requeue' } };

        }
    }

    return char;


}

async function extractAjaxTable(auctionid, itemsPage, itemType, htmlParent) {
    const ret = []

    if (!isNaN(itemsPage)) {
        for (let page = 1; page <= itemsPage; page++) {

            const url = `https://www.tibia.com/websiteservices/handle_charactertrades.php?auctionid=${auctionid}&type=${itemType}&currentpage=${page}`;

            const html = (page === 1) ? htmlParent : await loadAjaxTable(url);

            const data = (page === 1) ? html('.TableContent').eq(11 + itemType).find('.BlockPage > div') : html('.BlockPage').eq(0).find('> div');

            for (let i = 0; i < data.length; i++) {
                const row = data.eq(i);
                const title = row.attr('title').replace(/^\d+x\s/, '');
                const img = row.find('img').first().attr('src').replace('https://static.tibia.com/images/charactertrade', '');
                ret.push({
                    title: title.indexOf('\n') > -1 ? title.split('\n')[0] : title,
                    desc: title.indexOf('\n') > -1 ? title.split('\n')[1] : '',
                    img: !!img ? img.replace('https://static.tibia.com/images/charactertrade', '') : '',
                    amount: parseInt(row.find('.ObjectAmount').length > 0 ? row.find('.ObjectAmount').text() : 1)
                });
            }

        }

        for (let i = 0; i < ret.length; i++) {
            if (ret[i].desc === '') {
                ret[i] = {
                    title: ret[i].title, img: ret[i].img, amount: ret[i].amount
                }
            }
        }
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