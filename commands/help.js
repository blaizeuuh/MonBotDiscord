const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Affiche toutes les commandes disponibles du bot'),

	async execute(interaction) {
		// Embed principal avec toutes les commandes
		const helpEmbed = new EmbedBuilder()
			.setColor('#7289DA')
			.setTitle('🤖 Synergy Bot - Liste des commandes')
			.setDescription('Voici toutes les commandes disponibles :')
			.setThumbnail(interaction.client.user.displayAvatarURL())
			.addFields(
				{
					name: '🎮 **Jeux & Divertissement**',
					value: '`/8ball <question>` - Posez une question à la boule magique\n`/coinflip` - Lance une pièce (pile ou face)\n`/guessnumber` - Jeu de devinette de nombres\n`/clash-royale <tag>` - Stats d\'un joueur Clash Royale',
					inline: false
				},
				{
					name: '👥 **Utilisateurs & Serveur**',
					value: '`/avatar [utilisateur]` - Affiche l\'avatar d\'un utilisateur\n`/userinfo [utilisateur]` - Infos d\'un utilisateur\n`/membercount` - Nombre de membres du serveur',
					inline: false
				},
				{
					name: '🛠️ **Utilitaires**',
					value: '`/say <message>` - Fait dire quelque chose au bot\n`/poll <question>` - Crée un sondage avec réactions\n`/quote <message>` - Affiche une citation\n`/uptime` - Temps en ligne du bot',
					inline: false
				},
				{
					name: '🔧 **Modération**',
					value: '`/purge <nombre>` - Supprime des messages\n`/warn <utilisateur> [raison]` - Avertit un utilisateur\n`/reactrole` - Système de rôles par réaction',
					inline: false
				},
				{
					name: '🐱 **Fun**',
					value: '`/cat` - Image de chat aléatoire',
					inline: false
				}
			)
			.setFooter({ 
				text: `Demandé par ${interaction.user.username} • Total: 15 commandes`, 
				iconURL: interaction.user.displayAvatarURL() 
			})
			.setTimestamp();

		await interaction.reply({ embeds: [helpEmbed] });
	},
};