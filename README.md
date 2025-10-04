# MonBotDiscord

MonBotDiscord est un bot Discord moderne et flexible, conçu pour automatiser et enrichir votre serveur avec des fonctionnalités variées : modération, jeux, utilitaires, réactions automatiques, commandes personnalisées et bien plus encore.

---

## 🚀 Fonctionnalités principales

- **Modération automatisée** : gestion des messages, sanctions, logs.
- **Jeux & fun** : mini-jeux, quiz, commandes amusantes.
- **Utilitaires** : sondages, rappels, gestion des rôles, infos serveur.
- **Réactivité** : réponses automatiques, réactions personnalisées.
- **Extensible** : ajoutez facilement de nouvelles commandes ou modules.

---

## 🛠️ Installation & Lancement

### Prérequis

- Node.js (version 16 ou + recommandée)
- Un token de bot Discord ([Créer une application Discord](https://discord.com/developers/applications))

### Étapes

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/blaizeuuh/MonBotDiscord.git
   cd MonBotDiscord
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer le bot :**
   - Renommez `.env.example` en `.env`
   - Renseignez votre token Discord et autres variables nécessaires dans le fichier `.env`

4. **Lancer le bot :**
   ```bash
   npm start
   ```

---

## 📁 Architecture des dossiers

```
MonBotDiscord/
├── src/                 # Code source principal du bot
│   ├── commands/        # Commandes disponibles pour les utilisateurs
│   ├── events/          # Gestionnaires d'événements Discord
│   ├── utils/           # Fonctions utilitaires/modulaires
│   └── index.js         # Point d'entrée principal
├── config/              # Fichiers de configuration
├── .env.example         # Exemple de configuration des variables d'environnement
├── package.json         # Dépendances et scripts NPM
└── README.md            # Ce fichier
```

---

## ✨ Contribution

Les contributions sont les bienvenues ! N’hésitez pas à proposer des améliorations, corriger des bugs ou ajouter des fonctionnalités.

---

## 📄 Licence

Ce projet est sous licence MIT.

---

**Contact** : [blaizeuuh](https://github.com/blaizeuuh)
