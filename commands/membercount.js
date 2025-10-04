const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Affiche le nombre total de membres du serveur'),
  async execute(interaction) {
    const { guild } = interaction;

    const totalMembers = guild.memberCount;
    const humans = guild.members.cache.filter(member => !member.user.bot).size;
    const bots = guild.members.cache.filter(member => member.user.bot).size;

    const embed = new EmbedBuilder()
      .setTitle('📊 Statistiques des membres')
      .setColor(0x00AE86)
      .addFields(
        { name: '👥 Membres totaux', value: `${totalMembers}`, inline: true },
        { name: '🙋 Humains', value: `${humans}`, inline: true },
        { name: '🤖 Bots', value: `${bots}`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
