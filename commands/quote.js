const { SlashCommandBuilder } = require('discord.js');

const quotes = [
  "“La vie est un défi, relève-le.” – Mère Teresa",
  "“Ils ne savaient pas que c'était impossible, alors ils l'ont fait.” – Mark Twain",
  "“Le succès, c’est tomber sept fois, se relever huit.” – Proverbe japonais",
  "“Sois le changement que tu veux voir dans le monde.” – Gandhi",
  "“Celui qui déplace une montagne commence par déplacer de petites pierres.” – Confucius"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription("Reçoit une citation inspirante"),
  async execute(interaction) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    await interaction.reply(randomQuote);
  }
};
