const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const configDB = require('../config/database.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    console.log('guildMemberAdd déclenché pour', member.user.tag, 'sur le serveur', member.guild.name);
    
    // Récupérer la configuration du serveur
    const config = configDB.getConfig(member.guild.id);
    
    // ✅ Attribuer un rôle automatiquement (si configuré)
    if (config.settings.autoRole && config.roles.autoRole) {
      const role = member.guild.roles.cache.get(config.roles.autoRole);
      if (role) {
        try {
          await member.roles.add(role);
          console.log(`✅ Rôle attribué à ${member.user.tag}`);
        } catch (err) {
          console.error(`❌ Erreur lors de l'ajout du rôle :`, err);
        }
      }
    }

    // 🎉 Message de bienvenue (si activé et salon configuré)
    if (config.settings.welcomeMessage && config.channels.welcome) {
      try {
        // 🖼️ Création de l'image de bienvenue
        const canvas = createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        const background = await loadImage('https://cdn.modrinth.com/data/cached_images/f563e69bc655c58937afed34c3409cbfb526565b.jpeg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 35px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        const username = member.user.username.charAt(0).toUpperCase() + member.user.username.slice(1);

        const avatarCenterX = 125;
        const avatarCenterY = 125;
        const avatarRadius = 80;

        const textX = avatarCenterX + avatarRadius + 30;
        const textY = avatarCenterY;
        ctx.fillText(`Bienvenue ${username}`, textX, textY);

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
        ctx.drawImage(avatar, avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2, true);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        const buffer = canvas.toBuffer('image/png');
        const attachment = new AttachmentBuilder(buffer, { name: 'welcome.png' });

        const embed = new EmbedBuilder()
          .setTitle('🎉 Un nouveau membre est arrivé !')
          .setDescription(`Bienvenue à <@${member.id}> sur le serveur !`)
          .setColor(0x00AE86)
          .setImage('attachment://welcome.png');

        const welcomeChannel = member.guild.channels.cache.get(config.channels.welcome);

        if (welcomeChannel) {
          await welcomeChannel.send({ embeds: [embed], files: [attachment] });
        } else {
          console.warn('❗ Salon de bienvenue configuré mais introuvable');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la création du message de bienvenue:', error);
      }
    }
  },
};