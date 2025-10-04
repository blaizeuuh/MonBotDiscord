const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// En mémoire 
const warns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription("Avertit un membre du serveur")
    .addUserOption(option =>
      option.setName('membre').setDescription("Le membre à avertir").setRequired(true)
    )
    .addStringOption(option =>
      option.setName('raison').setDescription("La raison de l'avertissement").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison');

    if (user.bot) return interaction.reply({ content: "❌ Tu ne peux pas avertir un bot.", ephemeral: true });

    const previousWarns = warns.get(user.id) || [];
    previousWarns.push({ reason, date: new Date() });
    warns.set(user.id, previousWarns);

    const warnCount = previousWarns.length; // Compte le nombre d'avertissements
    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Avertissement x${warnCount}`)
      .setDescription(`Tu as reçu un avertissement !`)
      .addFields({ name: "Raison", value: reason })
      .setColor("Orange")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    try {
      await user.send(`⚠️ Tu as été averti dans **${interaction.guild.name}** pour : ${reason}`);
    } catch {
        console.error(`Impossible d'envoyer un message privé à ${user.tag}. Peut-être qu'il a désactivé les messages privés ?`);
        await interaction.followUp({ content: "❗ Je n'ai pas pu envoyer de message privé à l'utilisateur. Il se peut qu'il ait désactivé les messages privés.", ephemeral: true });
    }
  }
};
