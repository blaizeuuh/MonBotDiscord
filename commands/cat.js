const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription("Envoie une image aléatoire de chat"),

  async execute(interaction) {
    https.get('https://api.thecatapi.com/v1/images/search', (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const imageUrl = JSON.parse(data)[0].url;
        const embed = new EmbedBuilder()
          .setTitle("🐱 Miaou !")
          .setImage(imageUrl)
          .setColor("Random");

        interaction.reply({ embeds: [embed] });
      });
    }).on('error', (e) => {
      console.error(e);
      interaction.reply("❌ Impossible de récupérer une image de chat.");
    });
  }
};
