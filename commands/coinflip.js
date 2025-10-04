const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription("Lance une pièce : pile ou face ?"),
  async execute(interaction) {
    const result = Math.random() < 0.5 ? "🪙 Pile !" : "🪙 Face !";
    await interaction.reply(result);
  }
};
