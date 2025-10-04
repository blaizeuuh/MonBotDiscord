const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactrole')
    .setDescription("Crée un message de rôle avec boutons personnalisés")
    .addStringOption(option =>
      option.setName('message')
        .setDescription("Le message à afficher")
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role1')
        .setDescription("Premier rôle à donner")
        .setRequired(true))
    .addStringOption(option =>
      option.setName('label1')
        .setDescription("Texte du bouton 1")
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role2')
        .setDescription("Deuxième rôle à donner")
        .setRequired(true))
    .addStringOption(option =>
      option.setName('label2')
        .setDescription("Texte du bouton 2")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const msg = interaction.options.getString('message');
    const role1 = interaction.options.getRole('role1');
    const label1 = interaction.options.getString('label1');
    const role2 = interaction.options.getRole('role2');
    const label2 = interaction.options.getString('label2');

    const embed = new EmbedBuilder()
      .setTitle("🎭 Choix de rôle")
      .setDescription(msg)
      .setColor("Blurple");

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`rr_${role1.id}`)
          .setLabel(label1)
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`rr_${role2.id}`)
          .setLabel(label2)
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
