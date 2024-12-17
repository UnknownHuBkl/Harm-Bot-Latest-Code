const wait = require('wait')
require('dotenv').config()
const path = require('path')
const ReXx = require(`./structures/ReXx.js`)
const client = new ReXx()
this.config = require(`${process.cwd()}/config.json`);
(async () => {
    await client.initializeMongoose()
    await client.initializedata()
    await wait(3000);
    (await client.loadEvents()) - (await client.loadlogs())
    await client.loadMain()
    await client.login(this.config.TOKEN)

})()
