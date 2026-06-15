#  Around Activities

> Plateforme communautaire qui aide les nouveaux arrivants en France à découvrir des activités et rencontrer des personnes partageant les mêmes intérêts.

---

##  Table des matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Schéma de base de données](#-schéma-de-base-de-données)
- [API Routes](#-api-routes)
- [Temps réel (Socket.IO)](#-temps-réel-socketio)
- [Déploiement](#-déploiement)
- [Équipe](#-équipe)

---

##  Présentation

Around Activities est une application web fullstack permettant aux utilisateurs de :

- Découvrir des **activités communautaires** par catégorie et ville
- Rejoindre ou créer des **communautés** autour d'un intérêt commun
- Participer à des **sorties concrètes** (groupes)
- **Chatter en temps réel** avec les membres d'une activité ou d'un groupe
- Se connecter avec d'autres membres via un **système d'amitié**

L'architecture suit une hiérarchie à trois niveaux :

```
Catégorie → Activité (communauté + chat) → Groupes (sorties + chat)
```

---

##  Fonctionnalités

### Authentification
- Inscription en 2 étapes (informations personnelles + accès)
- Connexion avec JWT
- Onboarding avec sélection d'intérêts
- Réinitialisation de mot de passe

### Activités
- Exploration par catégorie et ville
- Création d'activité avec détection de doublons (400) et similaires (409)
- Rejoindre / quitter une communauté
- Voir les membres d'une activité
- Chat communautaire en temps réel

### Groupes (sorties)
- Création de sortie liée à une activité
- Rejoindre / quitter un groupe
- Chat de groupe en temps réel
- Détails : date, lieu, nombre de membres max

### Conversations
- Chat d'activité (communauté)
- Chat de groupe (sortie)
- Messages privés entre amis
- Filtres : Tout / Activités / Amis / Groupes

### Amis
- Envoi / acceptation / refus de demandes d'amitié
- Statut de relation en temps réel
- Messagerie privée

### Profil
- Modification des informations personnelles
- Gestion des intérêts
- Mes activités rejointes et créées

---

##  Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Next.js)                  │
│  Pages : home, activites, groupes, conversations,   │
│          profil, inscription, connexion, onboarding  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP + WebSocket
┌──────────────────────▼──────────────────────────────┐
│                  SERVEUR (Express)                   │
│  REST API + Socket.IO                               │
│  Middleware : JWT Auth, Error Handler               │
└──────────────────────┬──────────────────────────────┘
                       │ Prisma ORM
┌──────────────────────▼──────────────────────────────┐
│              BASE DE DONNÉES (PostgreSQL)            │
│  users, activities, groups, memberships,            │
│  activity_members, messages, friendships            │
└─────────────────────────────────────────────────────┘
```

---

##  Stack technique

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| Next.js | 15 | Framework React avec App Router |
| TypeScript | 5 | Typage statique |
| Tailwind CSS | 3 | Styling utilitaire |
| Socket.IO Client | 4 | Temps réel côté client |
| Lucide React | - | Icônes |

### Backend
| Technologie | Version | Usage |
|-------------|---------|-------|
| Node.js | 20+ | Runtime JavaScript |
| Express | 4 | Framework HTTP |
| Prisma | 7 | ORM TypeScript-first |
| Socket.IO | 4 | Temps réel côté serveur |
| JWT | - | Authentification |
| bcrypt | - | Hashage des mots de passe |

### Base de données
| Technologie | Usage |
|-------------|-------|
| PostgreSQL | Base de données relationnelle principale |

### Déploiement
| Technologie | Usage |
|-------------|-------|
| Coolify | PaaS auto-hébergé |
| Docker | Containerisation |

---

##  Structure du projet

```
around_activities/          ← Backend
├── server/
│   ├── config/
│   │   ├── prisma.js       ← Client Prisma (PrismaPg adapter)
│   │   └── socket.js       ← Initialisation Socket.IO
│   ├── constants/
│   │   └── activityCategories.js
│   ├── controllers/        ← Logique des routes
│   │   ├── activityController.js
│   │   ├── authController.js
│   │   ├── friendController.js
│   │   ├── groupController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── verifyToken.js  ← Middleware JWT
│   ├── routes/             ← Définition des routes Express
│   ├── services/           ← Logique métier
│   └── index.js            ← Point d'entrée + Socket.IO events
├── prisma/
│   ├── schema.prisma       ← Schéma de la BDD
│   └── migrations/         ← Historique des migrations
├── generated/
│   └── prisma/             ← Client Prisma généré
├── Dockerfile
└── .env

frontend-Around-Activities-V2/   ← Frontend
├── src/
│   ├── app/                ← Pages Next.js (App Router)
│   │   ├── activites/
│   │   │   ├── [id]/       ← Détail activité
│   │   │   └── creer/      ← Créer activité
│   │   ├── conversations/  ← Chat
│   │   ├── groupes/
│   │   ├── home/           ← Explorer activités
│   │   ├── inscription/    ← Inscription
│   │   ├── connexion/      ← Connexion
│   │   ├── mes-groupes/    ← Mes activités
│   │   ├── onboarding/     ← Choix des intérêts
│   │   └── profil/         ← Profil utilisateur
│   ├── components/
│   │   ├── GroupCard.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   ├── SocketContext.tsx
│   │   └── ToastContext.tsx
│   └── lib/
│       ├── api.ts          ← Toutes les fonctions API
│       └── data.ts         ← Types TypeScript + données statiques
├── Dockerfile
└── .env.local
```

---

##  Installation

### Prérequis
- Node.js 20+
- PostgreSQL 16+
- npm

### Backend

```bash
# Cloner le repo
git clone https://github.com/kourasoumare/Around-activities.git
cd Around-activities

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Appliquer les migrations
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Lancer le serveur
npm run dev
```

### Frontend

```bash
# Cloner le repo
git clone https://github.com/kourasoumare/frontend-Around-Activities-V2.git
cd frontend-Around-Activities-V2

# Installer les dépendances
npm install

# Configurer les variables d'environnement
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Lancer le frontend
npm run dev
```

>  **Mac (macOS)** : Le port 5000 est réservé par AirPlay Receiver. Désactive-le dans Préférences Système → Partage, ou utilise `PORT=5001` dans `.env` et `NEXT_PUBLIC_API_URL=http://localhost:5001` dans `.env.local`.

---

##  Variables d'environnement

### Backend (`.env`)

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=moncode000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=around_activities
JWT_SECRET=around_activities_secret_key
DATABASE_URL="postgresql://postgres:moncode000@localhost:5432/around_activities"
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

##  Schéma de base de données

```
users
├── id, first_name, last_name, email, password
├── city, origin, birth_date, language
├── avatar_url, bio
├── interests (string[])
└── is_new_user

activities
├── id, title, description, category, city
├── image_url, created_at
└── creator_id → users

groups
├── id, name, description, activity_id
├── meeting_date, location, max_members
├── contact_link, created_at
└── creator_id → users

memberships          ← membres d'un groupe
├── id, group_id → groups
└── user_id → users

activity_members     ← membres d'une activité
├── id, activity_id → activities
├── user_id → users
└── joined_at

messages             ← messages groupes ET privés
├── id, content, created_at
├── sender_id → users
├── group_id → groups (nullable)
└── receiver_id → users (nullable)

activity_messages    ← messages chat activité
├── id, content, created_at
├── activity_id → activities
└── sender_id → users

friendships
├── id, status (pending/accepted/refused)
├── requester_id → users
└── receiver_id → users

password_reset_tokens
├── id, token, expires_at
└── user_id → users
```

---

##  API Routes

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Users
```
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/me/groups
GET    /api/users/me/activities
GET    /api/users/:id
```

### Activities
```
GET    /api/activities
GET    /api/activities/:id
POST   /api/activities
POST   /api/activities/:id/join
DELETE /api/activities/:id/leave
GET    /api/activities/:id/members
```

### Groups
```
GET    /api/groups/:id
POST   /api/groups
POST   /api/groups/:id/join
DELETE /api/groups/:id/leave
DELETE /api/groups/:id
```

### Messages
```
GET    /api/messages/group/:groupId
GET    /api/messages/private/:userId
GET    /api/messages/activity/:activityId
POST   /api/messages
```

### Friends
```
GET    /api/friends
GET    /api/friends/requests
GET    /api/friends/status/:userId
POST   /api/friends/request/:userId
PUT    /api/friends/accept/:requestId
PUT    /api/friends/refuse/:requestId
```

---

## ⚡ Temps réel (Socket.IO)

### Authentification
Chaque connexion Socket.IO nécessite un token JWT dans `socket.handshake.auth.token`.

### Événements émis par le client

| Événement | Payload | Description |
|-----------|---------|-------------|
| `join_group` | `groupId` | Rejoindre la room d'un groupe |
| `send_message` | `{ group_id, content }` | Envoyer un message de groupe |
| `join_private` | `{ friendId }` | Rejoindre une room privée |
| `send_private_message` | `{ receiver_id, content }` | Envoyer un message privé |
| `join_activity` | `activityId` | Rejoindre le chat d'une activité |
| `send_activity_message` | `{ activity_id, content }` | Envoyer un message d'activité |

### Événements reçus par le client

| Événement | Description |
|-----------|-------------|
| `new_message` | Nouveau message dans un groupe |
| `new_private_message` | Nouveau message privé |
| `new_activity_message` | Nouveau message dans le chat d'une activité |
| `friend_request` | Nouvelle demande d'amitié |

---

##  Déploiement

Le projet est déployé sur **Coolify** (auto-hébergé).

### Services
- **Backend** : Dockerfile → Express sur port 5000
- **Frontend** : Dockerfile → Next.js sur port 3000
- **Base de données** : PostgreSQL managé par Coolify

### Workflow Git
```
feature/xxx → develop → main
```
- Les PRs sont reviewées et mergées par le chef de projet
- Coolify redéploie automatiquement sur push vers `main`

---

## 👥 Équipe

Projet réalisé dans le cadre du cursus **HETIC** (2025-2026).

| Membre | Rôle |
|--------|------|
| Koura | Chef de projet / Développeur fullstack |
| Bambi | Développeur backend |
