const { MessageEmbed } = require('discord.js');

this.config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'panicmode',
    aliases: ['pm'],
    cooldown: 10,
    category: 'security',
    premium: true,
    run: async (client, message, args) => {
        const whitelist = ['123456789012345678', '987654321098765432']; // Add whitelisted member IDs here
        const own = message.author.id === message.guild.ownerId;
        const check = await client.util.isExtraOwner(message.author, message.guild); // Check for extra owners

        // Restrict the command to server owners, extra owners, or whitelisted members
        if (!own && !check && !whitelist.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293> | **Only the server owner, extra owners, or whitelisted users can use this command.**`
                        )
                ]
            });
        }

        const option = args[0];

        // Show usage if no option is provided
        if (!option) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setTitle("**PanicMode Command Guide**")
                        .setDescription("PanicMode is a security feature that locks all text and voice channels in your server, preventing members from sending messages or joining voice channels. It can be used in emergency situations..")
                        .addFields(
                            { name: "Enable PanicMode", value: "`$panicmode enable`", inline: true },
                            { name: "Disable PanicMode", value: "`$panicmode disable`", inline: true }
                        )
                ]
            });
        }

        // Enable PanicMode: Lock all channels
        if (option === 'enable') {
            // Lock all text channels (disable sending messages)
            const textChannels = message.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');
            textChannels.forEach(async (channel) => {
                await channel.permissionOverwrites.edit(message.guild.id, {
                    SEND_MESSAGES: false, // Disable sending messages for everyone
                    VIEW_CHANNEL: true     // Allow viewing the channel
                }).catch(err => console.error(err));
            });

            // Lock all voice channels (disable joining)
            const voiceChannels = message.guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE');
            voiceChannels.forEach(async (channel) => {
                await channel.permissionOverwrites.edit(message.guild.id, {
                    CONNECT: false         // Disable joining voice channels for everyone
                }).catch(err => console.error(err));
            });

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | **PanicMode enabled!** All channels are locked.`
                        )
                ]
            });
        } 
        // Disable PanicMode: Unlock all channels
        else if (option === 'disable') {
            // Unlock all text channels (allow sending messages)
            const textChannels = message.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');
            textChannels.forEach(async (channel) => {
                await channel.permissionOverwrites.edit(message.guild.id, {
                    SEND_MESSAGES: true  // Allow sending messages for everyone
                }).catch(err => console.error(err));
            });

            // Unlock all voice channels (allow joining)
            const voiceChannels = message.guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE');
            voiceChannels.forEach(async (channel) => {
                await channel.permissionOverwrites.edit(message.guild.id, {
                    CONNECT: true        // Allow joining voice channels for everyone
                }).catch(err => console.error(err));
            });

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | **PanicMode disabled!** All channels are unlocked.`
                        )
                ]
            });
        } 
        else {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setTitle("**PanicMode Command Guide**")
                        .setDescription("PanicMode is a security feature that locks all text and voice channels in your server, preventing members from sending messages or joining voice channels. It can be used in emergency situations..")
                        .addFields(
                            { name: "Enable PanicMode", value: "`$panicmode enable`", inline: true },
                            { name: "Disable PanicMode", value: "`$panicmode disable`", inline: true }
                        )
                ]
            });
        }
    }
};
