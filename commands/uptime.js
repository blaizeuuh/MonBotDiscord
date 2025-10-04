const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription("Affiche depuis combien de temps le bot est en ligne"),
  async execute(interaction) {
    const totalSeconds = Math.floor(process.uptime());
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    await interaction.reply(`🟢 Je suis en ligne depuis : **${hours}h ${minutes}m ${seconds}s** a l'aide.`);
  }
};
