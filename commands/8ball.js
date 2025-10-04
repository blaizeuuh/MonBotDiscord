const { SlashCommandBuilder } = require('discord.js');

const responses = [
  "Oui.", "Non.", "Peut-être.", "Je ne pense pas.", "Bien sûr !",
  "Impossible à dire maintenant.", "Repose ta question.", "Probablement.",
  "Certainement pas.", "C’est possible."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription("Pose une question et la boule magique te répond")
    .addStringOption(option =>
      option.setName('question').setDescription("Ta question").setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const answer = responses[Math.floor(Math.random() * responses.length)];

    await interaction.reply(`🎱 **Question :** ${question}\n**Réponse :** ${answer}`);
  }
};
