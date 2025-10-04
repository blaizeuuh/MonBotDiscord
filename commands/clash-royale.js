const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clash-royale')
		.setDescription('Recherche les informations d\'un joueur Clash Royale')
		.addStringOption(option =>
			option.setName('tag')
				.setDescription('Le tag du joueur (sans le #, exemple: 2PP)')
				.setRequired(true)),

	async execute(interaction) {
		const playerTag = interaction.options.getString('tag');
		
		// Formatage du tag (ajout du # si nécessaire et mise en majuscule)
		const formattedTag = playerTag.startsWith('#') ? playerTag.toUpperCase() : `#${playerTag.toUpperCase()}`;

		try {
			await interaction.deferReply();

			// Appel à l'API Clash Royale
			const response = await axios.get(`https://api.clashroyale.com/v1/players/${encodeURIComponent(formattedTag)}`, {
				headers: {
					'Authorization': `Bearer ${process.env.CLASH_ROYALE_API_KEY}`,
					'Accept': 'application/json'
				}
			});

			const player = response.data;

			// Création de l'embed avec les informations du joueur
			const embed = new EmbedBuilder()
				.setColor('#00d4ff')
				.setTitle(`🏆 ${player.name}`)
				.setDescription(`**Tag:** ${player.tag}`)
				.setThumbnail(`https://cdn.royaleapi.com/static/img/arena/${player.arena.id}/arena.png`)
				.addFields(
					{ 
						name: '🏟️ Arène', 
						value: `${player.arena.name}`, 
						inline: true 
					},
					{ 
						name: '🏆 Trophées', 
						value: `${player.trophies.toLocaleString()}`, 
						inline: true 
					},
					{ 
						name: '🥇 Meilleur Score', 
						value: `${player.bestTrophies.toLocaleString()}`, 
						inline: true 
					},
					{ 
						name: '⭐ Niveau', 
						value: `${player.expLevel}`, 
						inline: true 
					},
					{ 
						name: '⚔️ Victoires', 
						value: `${player.wins.toLocaleString()}`, 
						inline: true 
					},
					{ 
						name: '💀 Défaites', 
						value: `${player.losses.toLocaleString()}`, 
						inline: true 
					},
					{ 
						name: '🎯 Ratio V/D', 
						value: `${(player.wins / (player.wins + player.losses) * 100).toFixed(1)}%`, 
						inline: true 
					},
					{ 
						name: '🃏 Cartes trouvées', 
						value: `${player.cards ? player.cards.length : 'N/A'}`, 
						inline: true 
					},
					{ 
						name: '💎 Gemmes totales', 
						value: `${player.totalDonations ? player.totalDonations.toLocaleString() : 'N/A'}`, 
						inline: true 
					}
				)
				.setFooter({ 
					text: 'Données fournies par l\'API Clash Royale', 
					iconURL: 'https://cdn.royaleapi.com/static/img/ui/cr-api-logo.png' 
				})
				.setTimestamp();

			// Ajout du clan si le joueur en fait partie
			if (player.clan) {
				embed.addFields({
					name: '🏰 Clan',
					value: `**${player.clan.name}**\nTag: ${player.clan.tag}\nRôle: ${player.role || 'Membre'}`,
					inline: false
				});
			}

			// Ajout de la saison actuelle si disponible
			if (player.currentPathOfLegendSeasonResult) {
				const season = player.currentPathOfLegendSeasonResult;
				embed.addFields({
					name: '🛤️ Saison Path of Legends',
					value: `Trophées: ${season.trophies}\nMeilleur: ${season.bestTrophies}`,
					inline: true
				});
			}

			await interaction.editReply({ embeds: [embed] });

		} catch (error) {
			console.error('Erreur lors de la récupération des données Clash Royale:', error);

			let errorMessage = 'Une erreur est survenue lors de la recherche du joueur.';

			if (error.response) {
				switch (error.response.status) {
					case 404:
						errorMessage = `❌ Aucun joueur trouvé avec le tag \`${formattedTag}\`. Vérifiez que le tag est correct.`;
						break;
					case 403:
						errorMessage = '❌ Accès refusé à l\'API Clash Royale. Vérifiez la clé API.';
						break;
					case 429:
						errorMessage = '❌ Trop de requêtes. Veuillez réessayer dans quelques minutes.';
						break;
					case 503:
						errorMessage = '❌ L\'API Clash Royale est temporairement indisponible.';
						break;
					default:
						errorMessage = `❌ Erreur API (${error.response.status}): ${error.response.data?.message || 'Erreur inconnue'}`;
				}
			}

			const errorEmbed = new EmbedBuilder()
				.setColor('#ff0000')
				.setTitle('❌ Erreur')
				.setDescription(errorMessage)
				.setFooter({ text: 'Clash Royale Player Search' })
				.setTimestamp();

			await interaction.editReply({ embeds: [errorEmbed] });
		}
	},
};