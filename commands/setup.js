const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const configDB = require('../config/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure les salons et rôles du bot pour ce serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('welcome')
        .setDescription('Définir le salon de bienvenue')
        .addChannelOption(option =>
          option.setName('salon')
            .setDescription('Salon où envoyer les messages de bienvenue')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('logs')
        .setDescription('Définir le salon des logs de tickets')
        .addChannelOption(option =>
          option.setName('salon')
            .setDescription('Salon où envoyer les logs des tickets')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('tickets')
        .setDescription('Définir le salon pour ouvrir les tickets')
        .addChannelOption(option =>
          option.setName('salon')
            .setDescription('Salon où les utilisateurs peuvent ouvrir des tickets')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('auto-role')
        .setDescription('Définir le rôle attribué automatiquement aux nouveaux membres')
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('Rôle à attribuer automatiquement')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('staff-role')
        .setDescription('Définir le rôle staff pour les tickets')
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('Rôle qui peut voir tous les tickets')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('Voir la configuration actuelle du serveur'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('reset')
        .setDescription('Réinitialiser toute la configuration du serveur')),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    switch (subcommand) {
      case 'welcome': {
        const channel = interaction.options.getChannel('salon');
        if (configDB.updateChannelConfig(guildId, 'welcome', channel.id)) {
          const embed = new EmbedBuilder()
            .setTitle('✅ Configuration mise à jour')
            .setDescription(`Le salon de bienvenue a été défini sur ${channel}`)
            .setColor(0x00AE86);
          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ content: '❌ Erreur lors de la sauvegarde de la configuration.', ephemeral: true });
        }
        break;
      }

      case 'logs': {
        const channel = interaction.options.getChannel('salon');
        if (configDB.updateChannelConfig(guildId, 'logs', channel.id)) {
          const embed = new EmbedBuilder()
            .setTitle('✅ Configuration mise à jour')
            .setDescription(`Le salon des logs a été défini sur ${channel}`)
            .setColor(0x00AE86);
          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ content: '❌ Erreur lors de la sauvegarde de la configuration.', ephemeral: true });
        }
        break;
      }

      case 'tickets': {
        const channel = interaction.options.getChannel('salon');
        if (configDB.updateChannelConfig(guildId, 'tickets', channel.id)) {
          const embed = new EmbedBuilder()
            .setTitle('✅ Configuration mise à jour')
            .setDescription(`Le salon des tickets a été défini sur ${channel}`)
            .setColor(0x00AE86);
          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ content: '❌ Erreur lors de la sauvegarde de la configuration.', ephemeral: true });
        }
        break;
      }

      case 'auto-role': {
        const role = interaction.options.getRole('role');
        if (configDB.updateRoleConfig(guildId, 'autoRole', role.id)) {
          const embed = new EmbedBuilder()
            .setTitle('✅ Configuration mise à jour')
            .setDescription(`Le rôle automatique a été défini sur ${role}`)
            .setColor(0x00AE86);
          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ content: '❌ Erreur lors de la sauvegarde de la configuration.', ephemeral: true });
        }
        break;
      }

      case 'staff-role': {
        const role = interaction.options.getRole('role');
        if (configDB.updateRoleConfig(guildId, 'staff', role.id)) {
          const embed = new EmbedBuilder()
            .setTitle('✅ Configuration mise à jour')
            .setDescription(`Le rôle staff a été défini sur ${role}`)
            .setColor(0x00AE86);
          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ content: '❌ Erreur lors de la sauvegarde de la configuration.', ephemeral: true });
        }
        break;
      }

      case 'view': {
        const config = configDB.getConfig(guildId);
        const guild = interaction.guild;

        const embed = new EmbedBuilder()
          .setTitle('⚙️ Configuration du serveur')
          .setColor(0x00AE86)
          .addFields(
            {
              name: '📢 Salons',
              value: [
                `🎉 Bienvenue: ${config.channels.welcome ? `<#${config.channels.welcome}>` : '❌ Non configuré'}`,
                `📰 Logs: ${config.channels.logs ? `<#${config.channels.logs}>` : '❌ Non configuré'}`,
                `🎫 Tickets: ${config.channels.tickets ? `<#${config.channels.tickets}>` : '❌ Non configuré'}`
              ].join('\n'),
              inline: false
            },
            {
              name: '🏷️ Rôles',
              value: [
                `🤖 Rôle automatique: ${config.roles.autoRole ? `<@&${config.roles.autoRole}>` : '❌ Non configuré'}`,
                `👨‍💼 Staff: ${config.roles.staff ? `<@&${config.roles.staff}>` : '❌ Non configuré'}`
              ].join('\n'),
              inline: false
            },
            {
              name: '⚙️ Paramètres',
              value: [
                `🎉 Messages de bienvenue: ${config.settings.welcomeMessage ? '✅ Activé' : '❌ Désactivé'}`,
                `🤖 Attribution automatique de rôle: ${config.settings.autoRole ? '✅ Activé' : '❌ Désactivé'}`,
                `🎫 Système de tickets: ${config.settings.ticketSystem ? '✅ Activé' : '❌ Désactivé'}`
              ].join('\n'),
              inline: false
            }
          )
          .setFooter({ text: 'Utilisez /setup <option> pour modifier ces paramètres' });

        await interaction.reply({ embeds: [embed] });
        break;
      }

      case 'reset': {
        if (configDB.deleteConfig(guildId)) {
          const embed = new EmbedBuilder()
            .setTitle('🔄 Configuration réinitialisée')
            .setDescription('Toute la configuration du serveur a été supprimée.')
            .setColor(0xFF6B6B);
          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ content: '❌ Erreur lors de la réinitialisation.', ephemeral: true });
        }
        break;
      }
    }
  },
};