const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription("Crée un sondage simple avec 👍/👎")
    .addStringOption(option =>
      option.setName('question').setDescription("Votre question").setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString('question');

    const message = await interaction.reply({ content: `📊 **Sondage :** ${question}`, fetchReply: true });
    await message.react('👍');
    await message.react('👎');
  }
};
