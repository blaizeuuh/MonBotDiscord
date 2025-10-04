const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    console.log('guildMemberAdd déclenché pour', member.user.tag, 'sur le serveur', member.guild.name);
    // ✅ Attribuer un rôle automatiquement
    const role = member.guild.roles.cache.get('1383824859716517899'); // l’ID de ton rôle administrateur 
    if (role) {
      try {
        await member.roles.add(role);
        console.log(`✅ Rôle attribué à ${member.user.tag}`);
      } catch (err) {
        console.error(`❌ Erreur lors de l'ajout du rôle :`, err);
      }
    }

    // 🖼️ Création de l'image de bienvenue
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await loadImage('https://cdn.modrinth.com/data/cached_images/f563e69bc655c58937afed34c3409cbfb526565b.jpeg'); // Image de fond
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Utilisation d'une police 
    ctx.font = 'bold 35px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Met la première lettre du pseudo en majuscule
    const username = member.user.username.charAt(0).toUpperCase() + member.user.username.slice(1);

    // Coordonnées du cercle (avatar)
    const avatarCenterX = 125;
    const avatarCenterY = 125;
    const avatarRadius = 80;

    // Texte à droite du logo, centré verticalement
    const textX = avatarCenterX + avatarRadius + 30;
    const textY = avatarCenterY;
    ctx.fillText(`Bienvenue ${username}`, textX, textY);

    // Avatar avec contour blanc de 2px
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
    ctx.drawImage(avatar, avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
    ctx.restore();

    // Contour blanc autour de l'avatar
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2, true);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Génération du buffer et création de l'attachment
    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'welcome.png' });

    // 📨 Envoi du message dans le salon de bienvenue
    const embed = new EmbedBuilder()
      .setTitle('🎉 Un nouveau membre est arrivé !')
      .setDescription(`Bienvenue à <@${member.id}> sur le serveur !`)
      .setColor(0x00AE86)
      .setImage('attachment://welcome.png');

    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === '🎉・bienvenue'); // adapte le nom du salon si besoin

    if (welcomeChannel) {
      welcomeChannel.send({ embeds: [embed], files: [attachment] });
    } else {
      console.warn('❗ Salon de bienvenue introuvable');
    }
  },
};

