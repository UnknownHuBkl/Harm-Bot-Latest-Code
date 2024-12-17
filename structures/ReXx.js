const { Client, Collection, Intents, WebhookClient } = require('discord.js')
const fs = require('fs')
const mongoose = require('mongoose')
const Utils = require('./util')
const { glob } = require('glob')
const { promisify } = require('util')
const { Database } = require('quickmongo')
const axios = require('axios')
const Sweepers = require('./Sweepers')
const { QuickDB } = require("quick.db");
const chalk = require('chalk');

module.exports = class Rex extends Client {
    constructor() {
        super({
            intents: 3276543,
            fetchAllMembers: false,
            shards: 'auto',
            disableEveryone: true
        })

        // Suppress warnings
        process.emitWarning = (warning, type, code, ctor, detail) => {
            if (
                warning.includes('DeprecationWarning') ||
                warning.includes('ExperimentalWarning') ||
                warning.includes('MaxListenersExceededWarning')
            ) {
                return;
            }
            process.emit('warning', warning, type, code, ctor, detail);
        };

        this.config = require(`${process.cwd()}/config.json`)
        this.logger = require('./logger')
        this.commands = new Collection()
        this.categories = fs.readdirSync('./commands/')
        this.emoji = {
            tick: '✅',
            cross: '❌',
            dot: '•'
        }
        this.util = new Utils(this)
        this.Sweeper = new Sweepers(this)
        this.color = `0x2b2d31`
        this.support = ` `
        this.cooldowns = new Collection()
        this.snek = require('axios')
        this.ratelimit = new WebhookClient({
            url: 'https://discord.com/api/webhooks/1318276606304977000/nZsp58lICoZvcejtdl6Gh6S3gts6-d6YH2vmXq3iGIuUjwoLkmgfxVzJIbxTHR52OT1Q'
        })
        this.error = new WebhookClient({
            url: "https://discord.com/api/webhooks/1318276606304977000/nZsp58lICoZvcejtdl6Gh6S3gts6-d6YH2vmXq3iGIuUjwoLkmgfxVzJIbxTHR52OT1Q"
        })

        this.on('error', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``)
        })
        process.on('unhandledRejection', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``)
        })
        process.on('uncaughtException', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``)
        })
        process.on('warning', (warn) => {
            this.error.send(`\`\`\`js\n${warn}\`\`\``)
        })
        process.on('uncaughtExceptionMonitor', (err, origin) => {
            this.error.send(`\`\`\`js\n${err},${origin}\`\`\``)
        })
        this.on('rateLimit', (info) => {
            this.ratelimit.send({
                content: `\`\`\`js\nTimeout: ${info.timeout},\nLimit: ${info.limit},\nMethod: ${info.method},\nPath: ${info.path},\nRoute: ${info.route},\nGlobal: ${info.global}\`\`\``
            })
        })
    }
    async initializedata() {
        this.data = new QuickDB()
        this.logger.log(`${chalk.green('Connecting')} to ${chalk.cyan('Sql')}...`, 'event')
        this.logger.log(`${chalk.green('Sql Database Connected')}`, 'ready')
    }
    async initializeMongoose() {
        this.db = new Database(this.config.MONGO_DB)
        this.db.connect()
        this.logger.log(`${chalk.green('Connecting')} to ${chalk.cyan('MongoDb')}...`, 'event')
        mongoose.connect(this.config.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        this.logger.log(`${chalk.green('Mongoose Database Connected')}`, 'ready')
    }

    async loadEvents() {
        const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'))
        this.logger.log(`${chalk.yellow('Loaded')} ${chalk.cyan(eventFiles.length)} ${chalk.yellow('events')}.`, 'event')
        for (const file of eventFiles) {
            require(`${process.cwd()}/events/${file}`)(this)
        }
    }

    async loadlogs() {
        const logFiles = fs.readdirSync('./logs/').filter(file => file.endsWith('.js'))
        this.logger.log(`${chalk.yellow('Loaded')} ${chalk.cyan(logFiles.length)} ${chalk.yellow('logs')}.`, 'event')
        for (const file of logFiles) {
            require(`${process.cwd()}/logs/${file}`)(this)
        }
    }
    async loadMain() {
        const commandFiles = []

        const commandDirectories = fs.readdirSync(`${process.cwd()}/commands`)

        for (const directory of commandDirectories) {
            const files = fs
                .readdirSync(`${process.cwd()}/commands/${directory}`)
                .filter((file) => file.endsWith('.js'))

            for (const file of files) {
                commandFiles.push(
                    `${process.cwd()}/commands/${directory}/${file}`
                )
            }
        }
        commandFiles.map((value) => {
            const file = require(value)
            const splitted = value.split('/')
            const directory = splitted[splitted.length - 2]
            if (file.name) {
                const properties = { directory, ...file }
                this.commands.set(file.name, properties)
            }
        })
        this.logger.log(`${chalk.yellow('Loaded')} ${chalk.cyan(this.commands.size)} ${chalk.yellow('commands')}.`, 'cmd')
    }
}