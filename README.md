
# 🤖 Webify Helper BOT

**Webify** est un bot Discord multifonction pour la gestion communautaire, les tickets, l'accueil automatique, l'attribution de rôles et la modération.

> 👑 Développé pour manager un seul et unique serveur

---

## ✨ Fonctionnalités

- 🎟️ Système de ticket privé avec bouton
- 👋 Message de bienvenue avec image personnalisée
- 🧾 Auto-rôle à l'arrivée d'un nouveau membre
- 🛠️ Commandes de modération : `/purge`, `/close`...
- 🔐 Système de vérification par bouton pour accéder au serveur
- 📩 Commandes slash modernes (`/`)

---

## 🚀 Installation locale

1. Clone ce dépôt :
   ```bash
   git clone https://github.com/ton-user/ton-repo.git
   cd ton-repo
   ```

2. Installe les dépendances :
   ```bash
   npm install
   ```

3. Crée un fichier `.env` :
   ```
   TOKEN=ton_token_discord
   CLIENT_ID=ton_id_application
   ```

4. Déploie les commandes slash :
   ```bash
   node deploy-commands.js
   ```

5. Lance le bot :
   ```bash
   npm start
   ```

---

## 🌐 Hébergement en ligne

Ce bot est compatible avec [Railway.app](https://railway.app) :

- Connecte ton dépôt GitHub
- Configure les variables `TOKEN` et `CLIENT_ID`
- Le bot démarre automatiquement avec `node index.js`

---

## 📁 Structure du projet

```
.
├── commands/          # Commandes slash (ex: purge, close)
├── events/            # Gestion des événements Discord (ex: ready, interactionCreate)
├── index.js           # Fichier principal du bot
├── deploy-commands.js # Déploiement des commandes /
├── .env               # Variables d’environnement (non poussé sur GitHub)
├── package.json       # Dépendances & script de lancement
└── README.md          # Description du projet
```

---

## 🛡️ Permissions requises pour le bot

Assure-toi que ton bot a ces permissions :
- Gérer les rôles
- Gérer les salons
- Lire les messages / Envoyer des messages
- Ajouter des réactions
- Utiliser les Slash Commands

---

## 📬 Contact

Pour toute suggestion ou aide, n’hésite pas à contacter le développeur **kvdpf** sur Discord 👑

---

## 📜 Licence

Ce projet est open-source. Utilisation libre à des fins non commerciales.
