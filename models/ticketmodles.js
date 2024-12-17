module.exports = {
    name: 'close',
    description: 'Close the current ticket.',
    run: async (client, interaction) => {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({
                content: 'This command can only be used inside a ticket channel.',
                ephemeral: true
            });
        }

        await interaction.channel.delete().catch((err) => {
            console.error(err);
            interaction.reply({
                content: 'There was an error closing the ticket.',
                ephemeral: true
            });
        });
    }
};