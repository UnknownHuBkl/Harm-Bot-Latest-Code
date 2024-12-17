const { MessageEmbed } = require('discord.js')
const { getSettingsar } = require('../../models/autorole')

module.exports = {
    name: 'welcomereset',
    category: 'welcomer',
    run: async (client, message, args) => {
        if (message.guild.memberCount < 5) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Your Server Doesn't Meet My 5 Member Criteria`
                        )
                ]
            })
        }
        const settings = await getSettingsar(message.guild)
        let response
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You must have \`Administration\` perms to run this command.`
                        )
                ]
            })
        }
        let isown = message.author.id == message.guild.ownerId
        if (!isown && !client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }
        let status = settings.welcome.enabled
        if (status !== true) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `The welcomer module for this server is already disabled.`
                        )
                ]
            })
        }
        await reset(client, settings)
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `<a:Tick:1306038825054896209> | Successfully reset the welcomer module.`
                    )
            ]
        })
    }
}

async function reset(client, settings) {
    ;(settings.welcome.enabled = false),
        (settings.welcome.channel = null),
        (settings.welcome.content = null),
        (settings.welcome.autodel = 0),
        (settings.welcome.embed = {
            image: null,
            description: null,
            color: null,
            title: null,
            thumbnail: false,
            footer: null
        })
    settings.save()
}
