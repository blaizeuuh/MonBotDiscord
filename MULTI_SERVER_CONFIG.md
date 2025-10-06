# Configuration Multi-Serveurs

Ce bot prend maintenant en charge plusieurs serveurs avec des configurations individuelles ! Fini les problèmes de `.env` avec des IDs fixes.

## 🚀 Installation sur un nouveau serveur

### 1. Inviter le bot
Le bot peut maintenant être invité sur n'importe quel serveur avec les permissions appropriées.

### 2. Configuration initiale
Une fois le bot sur votre serveur, utilisez la commande `/config init` pour voir l'assistant de configuration.

### 3. Étapes de configuration

#### Étape 1 : Configurer les salons
```
/setup welcome #salon-bienvenue
/setup logs #salon-logs  
/setup tickets #salon-tickets
```

#### Étape 2 : Configurer les rôles
```
/setup auto-role @Membre
/setup staff-role @Staff
```

#### Étape 3 : Activer les fonctionnalités
```
/config toggle welcomeMessage
/config toggle autoRole  
/config toggle ticketSystem
```

#### Étape 4 : Vérifier la configuration
```
/setup view
/config status
```

## 📋 Commandes disponibles

### Commandes de configuration (Administrateurs uniquement)

| Commande | Description |
|----------|-------------|
| `/setup welcome` | Définir le salon de bienvenue |
| `/setup logs` | Définir le salon des logs |
| `/setup tickets` | Définir le salon pour ouvrir les tickets |
| `/setup auto-role` | Définir le rôle automatique pour nouveaux membres |
| `/setup staff-role` | Définir le rôle staff pour les tickets |
| `/setup view` | Voir la configuration actuelle |
| `/setup reset` | Réinitialiser toute la configuration |

### Commandes de gestion

| Commande | Description |
|----------|-------------|
| `/config toggle` | Activer/désactiver une fonctionnalité |
| `/config status` | Voir l'état des fonctionnalités |
| `/config init` | Assistant de configuration |

## 🔧 Fonctionnalités configurables

### 🎉 Messages de bienvenue
- Image personnalisée avec avatar du membre
- Message dans le salon configuré
- Activable/désactivable par serveur

### 🤖 Attribution automatique de rôle
- Attribue automatiquement un rôle aux nouveaux membres
- Rôle configurable par serveur
- Activable/désactivable

### 🎫 Système de tickets
- Création automatique avec numérotation (ticket-001, ticket-002, etc.)
- Logs dans salon configuré
- Permissions automatiques pour staff
- Activable/désactivable

## 💾 Stockage des données

Les configurations sont stockées dans `config/servers.json` :
```json
{
  "guildId": {
    "channels": {
      "welcome": "channelId",
      "logs": "channelId", 
      "tickets": "channelId"
    },
    "roles": {
      "autoRole": "roleId",
      "staff": "roleId"
    },
    "settings": {
      "welcomeMessage": true,
      "autoRole": true,
      "ticketSystem": true
    },
    "ticketCounter": 5
  }
}
```

## 🔒 Sécurité

- Seuls les administrateurs peuvent modifier la configuration
- Vérifications automatiques des permissions
- Configuration isolée par serveur
- Aucun accès croisé entre serveurs

## 🆘 Dépannage

### Le bot ne répond pas aux commandes
1. Vérifiez que le bot a les permissions `APPLICATION_COMMANDS`
2. Redéployez les commandes avec `node deploy-commands.js`

### Les messages de bienvenue ne s'affichent pas
1. Vérifiez la configuration avec `/setup view`
2. Assurez-vous que la fonctionnalité est activée avec `/config status`
3. Vérifiez que le salon existe toujours

### Les tickets ne se créent pas
1. Vérifiez que la catégorie et le rôle staff sont configurés
2. Vérifiez les permissions du bot sur la catégorie
3. Assurez-vous que le système de tickets est activé

## 📝 Notes importantes

- Le fichier `.env` ne contient plus que le `TOKEN`, `CLIENT_ID` et les clés API
- Chaque serveur a sa propre configuration indépendante
- Les configurations sont sauvegardées automatiquement
- Le bot fonctionne même si certaines fonctionnalités ne sont pas configurées