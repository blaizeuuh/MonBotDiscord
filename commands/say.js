const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription("Fais parler le bot dans le salon actuel")
    .addStringOption(option =>
      option.setName('message')
        .setDescription("Message à envoyer")
        .setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString('message');
    
    await interaction.channel.send(message);
    await interaction.reply({ content: "✅ Message envoyé !", ephemeral: true });
  },
};
