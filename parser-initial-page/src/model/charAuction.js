const mongoose = require("mongoose");

const charAuctionSchema = new mongoose.Schema({
    _id: String,
    name: String,
    outfit: String,
    showRoomItems: [
        {
            _id: false,
            title: String,
            img: String
        }
    ],
    lastUpdate: Number,
    level: Number,
    vocation: String,
    sex: String,
    server: String,
    creationDate: Number,
    experience: Number,
    gold: Number,
    achivementPoints: Number,
    charm: {
        expansion: Boolean,
        available: Number,
        spent: Number
    },
    dailyRewardStrike: Number,
    huntingTask: {
        points: Number,
        taskSlot: Number,
        preySlot: Number
    },
    hirelings: Number,
    hirelingsJobs: Number,
    hirelingsOutfits: Number,
    auction: {
        startDate: Number,
        endDate: Number,
        value: Number,
        status: String
    },
    status: {
        hp: Number,
        mp: Number,
        capacity: Number,
        speed: Number
    },
    skins: {
        blessings: String,
        mounts: Number,
        outfits: Number,
        titles: Number
    },
    skills: {
        axe: Number,
        axeNL: Number,
        club: Number,
        clubNL: Number,
        distance: Number,
        distanceNL: Number,
        fishing: Number,
        fishingNL: Number,
        fist: Number,
        fistNL: Number,
        magic: Number,
        magicNL: Number,
        shield: Number,
        shieldNL: Number,
        sword: Number,
        swordNL: Number
    },
    blessings: {
        adventurersBlessing: Boolean,
        bloodOfTheMoutain: Boolean,
        embraceOfTibia: Boolean,
        fireOfTheSuns: Boolean,
        heartOfTheMountain: Boolean,
        sparkOfThePhoenix: Boolean,
        spiritualShielding: Boolean,
        twistOfFate: Boolean,
        wisdomOfSolitude: Boolean
    },
    imbuements: [String],
    quests: [String],
    titles: [String],
    achivements: [String],
    bestiary: [
        {
            _id: false,
            step: Number,
            kills: Number,
            name: String
        }
    ],
    charms: [
        {
            _id: false,
            value: Number,
            name: String
        }
    ],
    items: [
        {
            _id: false,
            title: String,
            desc: String,
            img: String,
            amount: Number
        }
    ],
    storeItems: [
        {
            _id: false,
            title: String,
            desc: String,
            img: String,
            amount: Number
        }
    ],
    mounts: [
        {
            _id: false,
            title: String,
            desc: String,
            img: String,
            amount: Number
        }
    ],
    storeMounts: [
        {
            _id: false,
            title: String,
            desc: String,
            img: String,
            amount: Number
        }
    ],
    outfits: [
        {
            _id: false,
            title: String,
            desc: String,
            img: String,
            amount: Number
        }
    ],
    storeOutfits: [
        {
            _id: false,
            title: String,
            desc: String,
            img: String,
            amount: Number
        }
    ],
    familiars: [
        {
            _id: false,
            title: String,
            desc: String,
            img: String,
            amount: Number
        }
    ]

});

exports.CharAuctionModel = mongoose.model('charAuction', charAuctionSchema);