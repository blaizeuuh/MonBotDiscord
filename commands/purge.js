const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('🧹 Supprime un nombre de messages dans ce salon')
    .addIntegerOption(option =>
      option.setName('nombre')
        .setDescription('Nombre de messages à supprimer (max 100)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const amount = interaction.options.getInteger('nombre');

    if (amount < 1 || amount > 100) {
      return await interaction.reply({
        content: '❌ Tu dois spécifier un nombre entre **1** et **100**.',
        ephemeral: true
      });
    }

    try {
      const deletedMessages = await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({
        content: `✅ ${deletedMessages.size} messages supprimés.`,
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Une erreur est survenue. Je ne peux peut-être pas supprimer certains messages (plus vieux que 14 jours ?)',
        ephemeral: true
      });
    }
  }
};
