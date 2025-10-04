require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (!command.data) {
    console.error(`❌ Le fichier ${file} n'exporte pas 'data'`);
    continue;
  }
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('⏳ Déploiement des commandes slash...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Commandes déployées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du déploiement :', error);
  }
})();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nom')
    .setDescription('Description'),
  async execute(interaction) {
    await interaction.reply('Commande de test exécutée avec succès !');
  }
};
