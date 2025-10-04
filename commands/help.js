const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Affiche toutes les commandes disponibles du bot'),

	async execute(interaction) {
		// Embed principal
		const mainEmbed = new EmbedBuilder()
			.setColor('#7289DA')
			.setTitle('🤖 Webify Bot - Centre d\'aide')
			.setDescription('Bienvenue ! Voici toutes les commandes disponibles. Utilisez le menu déroulant pour voir les détails de chaque catégorie.')
			.setThumbnail(interaction.client.user.displayAvatarURL())
			.addFields(
				{
					name: '🎮 Jeux & Divertissement',
					value: '`8ball` • `coinflip` • `guessnumber` • `clash-royale`',
					inline: false
				},
				{
					name: '👥 Utilisateurs & Serveur',
					value: '`avatar` • `userinfo` • `membercount`',
					inline: false
				},
				{
					name: '🛠️ Utilitaires',
					value: '`say` • `poll` • `quote` • `uptime`',
					inline: false
				},
				{
					name: '🔧 Modération',
					value: '`purge` • `warn` • `reactrole`',
					inline: false
				},
				{
					name: '🐱 Fun',
					value: '`cat`',
					inline: false
				}
			)
			.setFooter({ 
				text: `Demandé par ${interaction.user.username}`, 
				iconURL: interaction.user.displayAvatarURL() 
			})
			.setTimestamp();

		// Menu déroulant pour les catégories
		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId('help_category')
			.setPlaceholder('📋 Choisissez une catégorie pour voir les détails...')
			.addOptions([
				{
					label: '🎮 Jeux & Divertissement',
					description: 'Commandes de jeux et d\'amusement',
					value: 'games',
					emoji: '🎮'
				},
				{
					label: '👥 Utilisateurs & Serveur',
					description: 'Informations sur les utilisateurs et le serveur',
					value: 'users',
					emoji: '👥'
				},
				{
					label: '🛠️ Utilitaires',
					description: 'Outils pratiques pour le serveur',
					value: 'utils',
					emoji: '🛠️'
				},
				{
					label: '🔧 Modération',
					description: 'Commandes de modération',
					value: 'moderation',
					emoji: '🔧'
				},
				{
					label: '🐱 Fun',
					description: 'Commandes amusantes',
					value: 'fun',
					emoji: '🐱'
				},
				{
					label: '🏠 Retour au menu principal',
					description: 'Revenir à la vue d\'ensemble',
					value: 'main',
					emoji: '🏠'
				}
			]);

		const row = new ActionRowBuilder().addComponents(selectMenu);

		await interaction.reply({ embeds: [mainEmbed], components: [row] });

		// Collecteur pour le menu déroulant
		const filter = (i) => i.customId === 'help_category' && i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });

		collector.on('collect', async (i) => {
			let embed;
			
			switch (i.values[0]) {
				case 'games':
					embed = new EmbedBuilder()
						.setColor('#FF6B6B')
						.setTitle('🎮 Jeux & Divertissement')
						.setDescription('Amusez-vous avec ces commandes de jeux !')
						.addFields(
							{ name: '🎱 `/8ball <question>`', value: 'Posez une question à la boule magique', inline: false },
							{ name: '🪙 `/coinflip`', value: 'Lance une pièce (pile ou face)', inline: false },
							{ name: '🎯 `/guessnumber`', value: 'Jeu de devinette de nombres', inline: false },
							{ name: '⚔️ `/clash-royale <tag>`', value: 'Affiche les stats d\'un joueur Clash Royale', inline: false }
						)
						.setFooter({ text: 'Catégorie: Jeux & Divertissement' });
					break;

				case 'users':
					embed = new EmbedBuilder()
						.setColor('#4ECDC4')
						.setTitle('👥 Utilisateurs & Serveur')
						.setDescription('Obtenez des informations sur les utilisateurs et le serveur')
						.addFields(
							{ name: '🖼️ `/avatar [utilisateur]`', value: 'Affiche l\'avatar d\'un utilisateur', inline: false },
							{ name: '📊 `/userinfo [utilisateur]`', value: 'Affiche les informations d\'un utilisateur', inline: false },
							{ name: '👥 `/membercount`', value: 'Affiche le nombre de membres du serveur', inline: false }
						)
						.setFooter({ text: 'Catégorie: Utilisateurs & Serveur' });
					break;

				case 'utils':
					embed = new EmbedBuilder()
						.setColor('#45B7D1')
						.setTitle('🛠️ Utilitaires')
						.setDescription('Outils pratiques pour améliorer votre serveur')
						.addFields(
							{ name: '💬 `/say <message>`', value: 'Fait dire quelque chose au bot', inline: false },
							{ name: '📊 `/poll <question>`', value: 'Crée un sondage avec réactions', inline: false },
							{ name: '💭 `/quote <message>`', value: 'Affiche un message sous forme de citation', inline: false },
							{ name: '⏰ `/uptime`', value: 'Affiche depuis combien de temps le bot est en ligne', inline: false }
						)
						.setFooter({ text: 'Catégorie: Utilitaires' });
					break;

				case 'moderation':
					embed = new EmbedBuilder()
						.setColor('#F39C12')
						.setTitle('🔧 Modération')
						.setDescription('Commandes pour modérer votre serveur')
						.addFields(
							{ name: '🗑️ `/purge <nombre>`', value: 'Supprime un nombre de messages', inline: false },
							{ name: '⚠️ `/warn <utilisateur> [raison]`', value: 'Avertit un utilisateur', inline: false },
							{ name: '⚡ `/reactrole <message> <emoji> <rôle>`', value: 'Crée un système de rôles par réaction', inline: false }
						)
						.setFooter({ text: 'Catégorie: Modération' });
					break;

				case 'fun':
					embed = new EmbedBuilder()
						.setColor('#E74C3C')
						.setTitle('🐱 Fun')
						.setDescription('Commandes amusantes pour égayer votre serveur')
						.addFields(
							{ name: '🐱 `/cat`', value: 'Affiche une image de chat aléatoire', inline: false }
						)
						.setFooter({ text: 'Catégorie: Fun' });
					break;

				case 'main':
				default:
					embed = mainEmbed;
					break;
			}

			await i.update({ embeds: [embed], components: [row] });
		});

		collector.on('end', async () => {
			// Désactive le menu après expiration
			const disabledRow = new ActionRowBuilder()
				.addComponents(
					selectMenu.setDisabled(true)
				);
			
			try {
				await interaction.editReply({ components: [disabledRow] });
			} catch (error) {
				// Ignore les erreurs si le message a été supprimé
			}
		});
	},
};