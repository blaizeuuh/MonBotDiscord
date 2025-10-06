const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const configDB = require('../config/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Gérer les paramètres du bot pour ce serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('toggle')
        .setDescription('Activer/désactiver une fonctionnalité')
        .addStringOption(option =>
          option.setName('feature')
            .setDescription('Fonctionnalité à modifier')
            .setRequired(true)
            .addChoices(
              { name: '🎉 Messages de bienvenue', value: 'welcomeMessage' },
              { name: '🤖 Attribution automatique de rôle', value: 'autoRole' },
              { name: '🎫 Système de tickets', value: 'ticketSystem' }
            )))
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Voir l\'état de toutes les fonctionnalités'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('init')
        .setDescription('Assistant de configuration initiale pour un nouveau serveur')),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    switch (subcommand) {
      case 'toggle': {
        const feature = interaction.options.getString('feature');
        const config = configDB.getConfig(guildId);
        
        // Inverser l'état de la fonctionnalité
        config.settings[feature] = !config.settings[feature];
        
        if (configDB.setConfig(guildId, config)) {
          const featureNames = {
            'welcomeMessage': '🎉 Messages de bienvenue',
            'autoRole': '🤖 Attribution automatique de rôle',
            'ticketSystem': '🎫 Système de tickets'
          };
          
          const status = config.settings[feature] ? '✅ Activé' : '❌ Désactivé';
          
          const embed = new EmbedBuilder()
            .setTitle('⚙️ Paramètre modifié')
            .setDescription(`${featureNames[feature]}: ${status}`)
            .setColor(config.settings[feature] ? 0x00AE86 : 0xFF6B6B);
          
          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ content: '❌ Erreur lors de la sauvegarde.', ephemeral: true });
        }
        break;
      }

      case 'status': {
        const config = configDB.getConfig(guildId);
        
        const embed = new EmbedBuilder()
          .setTitle('📊 État des fonctionnalités')
          .addFields(
            {
              name: '🎉 Messages de bienvenue',
              value: config.settings.welcomeMessage ? '✅ Activé' : '❌ Désactivé',
              inline: true
            },
            {
              name: '🤖 Attribution automatique',
              value: config.settings.autoRole ? '✅ Activé' : '❌ Désactivé',
              inline: true
            },
            {
              name: '🎫 Système de tickets',
              value: config.settings.ticketSystem ? '✅ Activé' : '❌ Désactivé',
              inline: true
            }
          )
          .setColor(0x00AE86)
          .setFooter({ text: 'Utilisez /config toggle pour modifier ces paramètres' });
        
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case 'init': {
        const embed = new EmbedBuilder()
          .setTitle('🚀 Assistant de configuration')
          .setDescription('Bienvenue ! Pour configurer le bot sur votre serveur, suivez ces étapes :')
          .addFields(
            {
              name: '1️⃣ Configurer les salons',
              value: '• `/setup welcome` - Salon de bienvenue\n• `/setup logs` - Salon des logs\n• `/setup tickets` - Salon pour ouvrir les tickets',
              inline: false
            },
            {
              name: '2️⃣ Configurer les rôles',
              value: '• `/setup auto-role` - Rôle automatique pour nouveaux membres\n• `/setup staff-role` - Rôle staff pour les tickets',
              inline: false
            },
            {
              name: '3️⃣ Activer les fonctionnalités',
              value: '• `/config toggle` - Activer/désactiver les fonctionnalités\n• `/config status` - Voir l\'état actuel',
              inline: false
            },
            {
              name: '4️⃣ Vérifier la configuration',
              value: '• `/setup view` - Voir toute la configuration',
              inline: false
            }
          )
          .setColor(0x00AE86)
          .setFooter({ text: 'Astuce: Seuls les administrateurs peuvent utiliser ces commandes' });
        
        await interaction.reply({ embeds: [embed] });
        break;
      }
    }
  },
};