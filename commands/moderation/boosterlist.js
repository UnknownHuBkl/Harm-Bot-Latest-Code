const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'boosterlist',
    aliases: ['boosters'],
    category: 'info',
    premium: false,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        // Check if the user has 'MANAGE_GUILD' permission to see the booster list
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Server\` permission to use this command.`
                        )
                ]
            });
        }

        // Get the 'Booster' role (usually named 'Booster' or similar)
        const boosterRole = message.guild.roles.cache.find(role => role.name.toLowerCase().includes('booster'));

        // Check if the server has a 'Booster' role
        if (!boosterRole) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | This server doesn't have a 'Booster' role or it's not named correctly.`
                        )
                ]
            });
        }

        // Get all the members in the server with the 'Booster' role
        const boosters = message.guild.members.cache.filter(member => member.roles.cache.has(boosterRole.id));

        if (boosters.size === 0) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | There are no boosters in this server.`
                        )
                ]
            });
        }

        // Format the list of boosters
        const boosterList = boosters.map((member, index) => `**${index + 1}.** ${member.user.tag}`).join('\n');

        // Send the embed with the list of boosters
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setTitle('List of Boosters')
                    .setDescription(boosterList)
                    .setFooter(`Total Boosters: ${boosters.size}`)
            ]
        });
    }
};
