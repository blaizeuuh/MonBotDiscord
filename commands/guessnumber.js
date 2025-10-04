const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guessnumber')
    .setDescription('Devine le nombre auquel je pense (entre 1 et 100) !'),
  async execute(interaction) {
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    const maxAttempts = 5;

    await interaction.reply(`🎯 Je pense à un nombre entre **1 et 100**.\nTu as **${maxAttempts} tentatives** (ou 30 secondes) pour deviner. Envoie tes essais dans ce salon !`);

    const filter = msg =>
      msg.author.id === interaction.user.id &&
      !isNaN(msg.content) &&
      parseInt(msg.content) >= 1 &&
      parseInt(msg.content) <= 100;

    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 30000
    });

    collector.on('collect', msg => {
      attempts++;
      const guess = parseInt(msg.content);

      if (guess === targetNumber) {
        msg.reply(`✅ Bien joué ! Le nombre était **${targetNumber}**. Trouvé en ${attempts} tentative(s) !`);
        collector.stop('guessed');
      } else if (attempts >= maxAttempts) {
        msg.reply(`❌ Faux. Tu as utilisé tes ${maxAttempts} tentatives. Le bon nombre était **${targetNumber}**.`);
        collector.stop('failed');
      } else {
        msg.reply(`❌ Ce n'est pas le bon nombre. Il te reste **${maxAttempts - attempts}** tentative(s).`);
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        interaction.followUp({
          content: `⏰ Temps écoulé ! Le bon nombre était **${targetNumber}**.`,
          ephemeral: true
        });
      }
    });
  },
};
