# 1. tibia-auctioneer

- [1. tibia-auctioneer](#1-tibia-auctioneer)
  - [1.1. Indexes](#11-indexes)

## 1.1. Indexes

```sh
db.charauctions.createIndex({                     'server':1, 'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.axe':1,      'server':1,'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.sword':1,    'server':1,'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.club':1,     'server':1,'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.fist':1,     'server':1,'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.distance':1, 'server':1,'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.magic':1,    'server':1,'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.shield':1,   'server':1,'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.fishing':1,  'server':1,'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })


db.charauctions.createIndex({                     'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.axe':1,      'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.sword':1,    'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.club':1,     'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.fist':1,     'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.distance':1, 'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.magic':1,    'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.shield':1,   'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })
db.charauctions.createIndex({'skills.fishing':1,  'auction.status':1,'auction.value':1, 'level':1, 'auction.endDate':1 })

```
