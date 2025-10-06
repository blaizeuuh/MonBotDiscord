const fs = require('fs');
const path = require('path');

class ConfigDatabase {
  constructor() {
    this.configPath = path.join(__dirname, 'servers.json');
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(path.dirname(this.configPath))) {
      fs.mkdirSync(path.dirname(this.configPath), { recursive: true });
    }
    if (!fs.existsSync(this.configPath)) {
      fs.writeFileSync(this.configPath, JSON.stringify({}, null, 2));
    }
  }

  getConfig(guildId) {
    try {
      const data = fs.readFileSync(this.configPath, 'utf8');
      const configs = JSON.parse(data);
      return configs[guildId] || this.getDefaultConfig();
    } catch (error) {
      console.error('Erreur lors de la lecture de la configuration:', error);
      return this.getDefaultConfig();
    }
  }

  setConfig(guildId, config) {
    try {
      const data = fs.readFileSync(this.configPath, 'utf8');
      const configs = JSON.parse(data);
      configs[guildId] = { ...this.getDefaultConfig(), ...config };
      fs.writeFileSync(this.configPath, JSON.stringify(configs, null, 2));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration:', error);
      return false;
    }
  }

  updateChannelConfig(guildId, channelType, channelId) {
    const config = this.getConfig(guildId);
    config.channels[channelType] = channelId;
    return this.setConfig(guildId, config);
  }

  updateRoleConfig(guildId, roleType, roleId) {
    const config = this.getConfig(guildId);
    config.roles[roleType] = roleId;
    return this.setConfig(guildId, config);
  }

  getDefaultConfig() {
    return {
      channels: {
        welcome: null,          // Salon de bienvenue
        logs: null,             // Salon des logs tickets
        tickets: null           // Salon pour ouvrir des tickets
      },
      roles: {
        admin: null,            // Rôle administrateur
        autoRole: null,         // Rôle attribué automatiquement aux nouveaux membres
        staff: null             // Rôle staff pour les tickets
      },
      settings: {
        autoRole: true,         // Activer l'attribution automatique de rôle
        welcomeMessage: true,   // Activer les messages de bienvenue
        ticketSystem: true      // Activer le système de tickets
      },
      ticketCounter: 0          // Compteur pour numéroter les tickets
    };
  }

  getAllConfigs() {
    try {
      const data = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erreur lors de la lecture des configurations:', error);
      return {};
    }
  }

  incrementTicketCounter(guildId) {
    const config = this.getConfig(guildId);
    config.ticketCounter = (config.ticketCounter || 0) + 1;
    this.setConfig(guildId, config);
    return config.ticketCounter;
  }

  deleteConfig(guildId) {
    try {
      const data = fs.readFileSync(this.configPath, 'utf8');
      const configs = JSON.parse(data);
      delete configs[guildId];
      fs.writeFileSync(this.configPath, JSON.stringify(configs, null, 2));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la configuration:', error);
      return false;
    }
  }
}

module.exports = new ConfigDatabase();