const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription("Affiche les informations d'un utilisateur")
    .addUserOption(option =>
      option.setName('utilisateur').setDescription("L'utilisateur à inspecter").setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`Informations de ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "👤 Nom complet", value: `${user.tag}`, inline: true },
        { name: "🆔 ID", value: `${user.id}`, inline: true },
        { name: "📆 A rejoint Discord le", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
        { name: "📥 A rejoint le serveur le", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
        { name: "🔖 Rôles", value: member.roles.cache.map(r => r).join(', '), inline: false }
      )
      .setColor("Random");

    await interaction.reply({ embeds: [embed] });
  },
};
