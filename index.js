require('dotenv').config();
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType, Collection, ActivityType } = require('discord.js');
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const configDB = require('./config/database.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

// Chargement des commandes
const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Chargement des événements
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.once('ready', async () => {
  console.log(`🤖 Connecté en tant que ${client.user.tag}`);
  
  client.user.setPresence({
    activities: [
      {
        name: "comment vous aider..",
        type: ActivityType.Watching,
      },
    ],
    status: "online",
  });

  // Initialiser le système de tickets pour chaque serveur configuré
  for (const guild of client.guilds.cache.values()) {
    const config = configDB.getConfig(guild.id);
    
    if (config.settings.ticketSystem && config.channels.tickets) {
      const ticketChannel = guild.channels.cache.get(config.channels.tickets);
      if (!ticketChannel) continue;

      const recentMessages = await ticketChannel.messages.fetch({ limit: 10 });
      const botAlreadySent = recentMessages.some(msg => msg.author.id === client.user.id);
      if (botAlreadySent) continue;

      const embed = new EmbedBuilder()
        .setTitle('🎫  Ouvre un ticket')
        .setDescription('Clique sur le bouton ci-dessous pour créer un salon privé avec le staff ou bien parler de ton projet.')
        .setColor(0x00AE86);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('createTicket')
          .setLabel('🎟️ Créer un ticket')
          .setStyle(ButtonStyle.Primary)
      );

      await ticketChannel.send({ embeds: [embed], components: [row] });
    }
  }
});

// Gestion des interactions (slash + boutons)
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '⛔ Une erreur est survenue avec cette commande.', ephemeral: true });
    }
  }

  if (interaction.isButton()) {
    const { guild, user, customId } = interaction;

    // 🔹 Ticket system
    if (customId === 'createTicket') {
      const config = configDB.getConfig(guild.id);
      
      if (!config.settings.ticketSystem) {
        return interaction.reply({ content: '❌ Le système de tickets n\'est pas activé sur ce serveur.', ephemeral: true });
      }

      if (!config.roles.staff) {
        return interaction.reply({ content: '❌ Le rôle staff n\'est pas configuré.', ephemeral: true });
      }

      // Vérifier si l'utilisateur a déjà un ticket ouvert
      const existingChannel = guild.channels.cache.find(c => c.name.startsWith('ticket-') && c.topic === `Ticket créé par ${user.id}`);
      if (existingChannel) return interaction.reply({ content: '❌ Tu as déjà un ticket ouvert.', ephemeral: true });

      // Obtenir le numéro du prochain ticket
      const ticketNumber = configDB.incrementTicketCounter(guild.id);
      const ticketName = `ticket-${String(ticketNumber).padStart(3, '0')}`;

      const staffRoleId = config.roles.staff;

      const ticketChannel = await guild.channels.create({
        name: ticketName,
        type: ChannelType.GuildText,
        topic: `Ticket créé par ${user.id}`,
        permissionOverwrites: [
          { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
          { id: staffRoleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ]
      });

      const embed = new EmbedBuilder()
        .setTitle(`🎟️ ${ticketName}`)
        .setDescription(`Ticket créé par ${user}\nUn membre du staff te répondra ici bientôt.\n\nPour fermer le ticket, clique sur le bouton ci-dessous.`)
        .setColor(0x00AE86)
        .setFooter({ text: `Ticket #${ticketNumber}` });

      const closeButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('closeTicket')
          .setLabel('🔒 Fermer le ticket')
          .setStyle(ButtonStyle.Danger)
      );

      await ticketChannel.send({ content: `<@${user.id}>`, embeds: [embed], components: [closeButton] });
      await interaction.reply({ content: `✅ Ton ticket a été créé : ${ticketChannel}`, ephemeral: true });

      if (config.channels.logs) {
        const logChannel = guild.channels.cache.get(config.channels.logs);
        if (logChannel) {
          logChannel.send(`📥 **${ticketName}** ouvert par ${user.tag} → ${ticketChannel}`);
        }
      }
    }

    if (customId === 'closeTicket') {
      const config = configDB.getConfig(interaction.guild.id);
      
      if (config.channels.logs) {
        const logChannel = interaction.guild.channels.cache.get(config.channels.logs);
        if (logChannel) {
          logChannel.send(`📤 **${interaction.channel.name}** fermé par ${interaction.user.tag}`);
        }
      }

      await interaction.reply({ content: '⏳ Fermeture du ticket dans 5 secondes...', ephemeral: true });
      setTimeout(() => {
        if (interaction.channel) {
          interaction.channel.delete().catch(() => {});
        }
      }, 5000);
    }

    // 🔹 Gestion des boutons de rôles (/reactrole)
    if (customId.startsWith('rr_')) {
      const roleId = customId.split('_')[1];
      const role = interaction.guild.roles.cache.get(roleId);
      const member = interaction.member;

      if (!role) return interaction.reply({ content: "❌ Rôle introuvable.", ephemeral: true });

      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        return interaction.reply({ content: `❌ Rôle **${role.name}** retiré.`, ephemeral: true });
      } else {
        await member.roles.add(role);
        return interaction.reply({ content: `✅ Rôle **${role.name}** ajouté.`, ephemeral: true });
      }
    }
  }
});

client.login(process.env.TOKEN);
