const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'ping',
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        let ping = client.ws.ping
        let text = ''
        if (ping >= 0 && ping <= 20) {
            text = 'SSC Tuatara!'
        } else if (ping >= 21 && ping <= 30) {
            text = 'GTR!'
        } else if (ping >= 31 && ping <= 50) {
            text = 'Fiat 124!'
        } else if (ping >= 51 && ping <= 70) {
            text = 'Volkswagon!'
        } else if (ping >= 71 && ping <= 100) {
            text = 'Dacia!'
        } else {
            text = 'Tata Nano!'
        }
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setAuthor({
                        name: `${client.ws.ping}ms Pong!`,
                        iconURL: `${message.member.user.displayAvatarURL({
                            dynamic: true
                        })}`
                    })
                    .setColor(client.color)
                    .setFooter({
                        text: `Respond Speed: ${text}`,
                        iconURL: client.user.displayAvatarURL()
                    })
            ]
        })
    }
}
