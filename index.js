require('dotenv').config();
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType, Collection, ActivityType } = require('discord.js');
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

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

  // Envoi auto du message de création de ticket
  const ticketChannel = client.channels.cache.find(ch => ch.name === '📩・ouvrir-un-ticket');
  if (!ticketChannel) return console.log('⛔ Salon "📩・ouvrir-un-ticket" introuvable.');

  const recentMessages = await ticketChannel.messages.fetch({ limit: 10 });
  const botAlreadySent = recentMessages.some(msg => msg.author.id === client.user.id);
  if (botAlreadySent) return;

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
      const existingChannel = guild.channels.cache.find(c => c.name === `ticket-${user.username.toLowerCase()}`);
      if (existingChannel) return interaction.reply({ content: '❌ Tu as déjà un ticket ouvert.', ephemeral: true });

      const categoryId = '1383803285718437948'; // Remplace par l'ID de ta catégorie
      const adminRoleId = '1383803855464169612'; // Remplace par l'ID de ton rôle staff/admin

      const ticketChannel = await guild.channels.create({
        name: `ticket-${user.username}`,
        type: ChannelType.GuildText,
        parent: categoryId,
        permissionOverwrites: [
          { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
          { id: adminRoleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ]
      });

      const embed = new EmbedBuilder()
        .setTitle(`🎟️ Ticket de ${user.username}`)
        .setDescription('Un membre du staff te répondra ici bientôt.\nPour fermer le ticket, clique sur le bouton ci-dessous.')
        .setColor(0x00AE86);

      const closeButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('closeTicket')
          .setLabel('🔒 Fermer le ticket')
          .setStyle(ButtonStyle.Danger)
      );

      await ticketChannel.send({ content: `<@${user.id}>`, embeds: [embed], components: [closeButton] });
      await interaction.reply({ content: `✅ Ton ticket a été créé : ${ticketChannel}`, ephemeral: true });

      const logChannel = guild.channels.cache.find(ch => ch.name === '📰・logs-tickets');
      if (logChannel) {
        logChannel.send(`📥 Ticket ouvert par ${user.tag} → ${ticketChannel}`);
      }
    }

    if (customId === 'closeTicket') {
      const logChannel = interaction.guild.channels.cache.find(ch => ch.name === '📰・logs-tickets');
      if (logChannel) {
        logChannel.send(`📤 Ticket fermé par ${interaction.user.tag} → #${interaction.channel.name}`);
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
