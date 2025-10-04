const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Affiche l'avatar d’un membre")
    .addUserOption(option =>
      option.setName('utilisateur').setDescription("L'utilisateur").setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur') || interaction.user;
    const avatar = user.displayAvatarURL({ dynamic: true, size: 1024 });

    const embed = new EmbedBuilder()
      .setTitle(`Avatar de ${user.username}`)
      .setImage(avatar)
      .setColor('Random');

    await interaction.reply({ embeds: [embed] });
  }
};
