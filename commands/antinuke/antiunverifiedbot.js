const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

this.config = require(`${process.cwd()}/config.json`);

mongoose.connect(this.config.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schema for AntiUnverifiedBot feature settings
const AntiUnverifiedBotSchema = new mongoose.Schema({
    guildId: String,
    enabled: Boolean
});

const AntiUnverifiedBot = mongoose.model('AntiUnverifiedBot', AntiUnverifiedBotSchema);

module.exports = {
    name: 'antiunverifiedbot',
    aliases: ['aub'],
    cooldown: 10,
    category: 'security',
    premium: false,
    run: async (client, message, args) => {
        if (message.guild.memberCount < 5) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | **Your Server Doesn't Meet My 5 Member Criteria**`
                        )
                ]
            });
        }

        // Check if the user has permission to use this command
        let own = message.author.id == message.guild.ownerId;
        if (!own) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | **Only the server owner is authorized to execute this command.**`
                        )
                ]
            });
        }

        const option = args[0];

        // Fetch the current anti-unverified bot setting from the database
        let guildSettings = await AntiUnverifiedBot.findOne({ guildId: message.guild.id });

        if (!guildSettings) {
            guildSettings = new AntiUnverifiedBot({
                guildId: message.guild.id,
                enabled: false
            });
            await guildSettings.save();
        }

        const AntiUnverifiedBotEmbed = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Anti-Unverified Bot**__`)
            .setDescription(
                '**The Anti-Unverified Bot feature helps prevent unverified bots from joining your server. Enable it to block these bots, and disable it to allow them again.**'
            )
            .addFields([
                { name: '__Anti-Unverified Bot Enable__', value: `Enable by using \`${message.guild.prefix || '$'}antiunverifiedbot enable\`` },
                { name: '__Anti-Unverified Bot Disable__', value: `Disable by using \`${message.guild.prefix || '$'}antiunverifiedbot disable\`` }
            ]);

        if (!option) {
            return message.channel.send({ embeds: [AntiUnverifiedBotEmbed] });
        }

        if (option === 'enable') {
            if (guildSettings.enabled) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | **Anti-Unverified Bot is already enabled in this server.**`
                            )
                    ]
                });
            }

            // Enable the Anti-Unverified Bot feature
            guildSettings.enabled = true;
            await guildSettings.save();

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | **Anti-Unverified Bot has been enabled! Unverified bots will now be blocked from joining the server.**`
                        )
                ]
            });
        }

        if (option === 'disable') {
            if (!guildSettings.enabled) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | **Anti-Unverified Bot is already disabled in this server.**`
                            )
                    ]
                });
            }

            // Disable the Anti-Unverified Bot feature
            guildSettings.enabled = false;
            await guildSettings.save();

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | **Anti-Unverified Bot has been disabled! Unverified bots can now join the server.**`
                        )
                ]
            });
        }

        // If an invalid option is provided
        return message.channel.send({ embeds: [AntiUnverifiedBotEmbed] });
    }
};
