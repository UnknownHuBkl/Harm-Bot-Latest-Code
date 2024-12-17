const { MessageEmbed } = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)
module.exports = {
    name: `leaveserver`,
    category: `Owner`,
    aliases: [`gl`, `gleave`],
    description: `Leaves A Guild`,
    run: async (client, message, args) => {
        if (!this.config.admin.includes(message.author.id)) return
        let id = args[0]
        if (!id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't provided the server Id.`
                        )
                ]
            })
        }
        let guild = await client.guilds.fetch(id)
        let name = guild?.name || 'No Name Found'
        if (!guild) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't provided a valid server Id.`
                        )
                ]
            })
        }
        await guild.leave()
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `<a:Tick:1306038825054896209> | Successfully left **${name} (${id})**.`
                    )
            ]
        })
    }
}
