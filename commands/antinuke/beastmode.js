const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const mongoose = require('mongoose')
const wait = require('wait')

const ricky = ['1300534329402982472', '1300534329402982472']

this.config = require(`${process.cwd()}/config.json`)

mongoose.connect(this.config.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const ExtraOwnerSchema = new mongoose.Schema({
    guildId: String,
    userId: String
})
const extraOwnerSchema = mongoose.model('ExtraOwner', ExtraOwnerSchema)

module.exports = {
    name: 'dangermode',
    aliases: ['dm'],
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
            })
        }

        let own = message.author.id == message.guild.ownerId
        const check = await client.util.isExtraOwner(
            message.author,
            message.guild
        )
        if (!own && !check && !ricky.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | **Only the server owner or an extra owner with higher role than mine is authorized to execute this command.**`
                        )
                ]
            })
        }

        let prefix = '$' || message.guild.prefix
        const option = args[0]

        const Dangermode = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Dangermode**__`)
            .setDescription(
                '**The Dangermode feature allows you to remove extra owners (users with the `extraowner` role) from your server. It will ensure that users who are not trusted will no longer have special privileges.**'
            )
            .addFields([
                { name: '__Dangermode Enable__', value: `Enable Dangermode by using \`${prefix}dangermode enable\`` },
                { name: '__Dangermode Disable__', value: `Disable Dangermode by using \`${prefix}dangermode disable\`` }
            ])

        if (!option) {
            return message.channel.send({ embeds: [Dangermode] })
        }

        if (option === 'enable') {
            // Fetch all users with 'extraowner' role
            const extraOwnerRole = message.guild.roles.cache.find(role => role.name === 'extraowner')
            if (!extraOwnerRole) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | **No 'extraowner' role found in this server.**`
                            )
                    ]
                })
            }

            const extraOwners = message.guild.members.cache.filter(member => member.roles.cache.has(extraOwnerRole.id))
            
            if (extraOwners.size === 0) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | **No extra owners found in this server.**`
                            )
                    ]
                })
            }

            // Remove users with 'extraowner' role from the database
            const promises = extraOwners.map(async (member) => {
                try {
                    await extraOwnerSchema.findOneAndDelete({
                        guildId: message.guild.id,
                        userId: member.id
                    }).catch((err) => null)
                    
                    await member.roles.remove(extraOwnerRole, `**Harm-Advance's Dangermode ENABLED**`)
                } catch (err) {
                    console.error(err)
                }
            })

            await Promise.all(promises)

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | **Dangermode enabled! Removed extra owners and their privileges.**`
                        )
                ]
            })
        } else if (option === 'disable') {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | **Dangermode disabled! No changes made.**`
                        )
                ]
            })
        } else {
            return message.channel.send({ embeds: [Dangermode] })
        }
    }
}
