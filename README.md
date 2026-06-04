# 🏋️ Muscu App — Programme de Prise de Poids

Application web de suivi de programme de musculation et nutrition, basée sur une base de données SQLite.

## Stack

| Composant | Technologie |
|-----------|------------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express |
| Base de données | SQLite (better-sqlite3) |
| Conteneurisation | Docker + Docker Compose |

## Fonctionnalités

- **Profil** : données personnelles (âge, taille, poids, objectif)
- **Entraînement** : 3 jours/semaine avec exercices détaillés (muscles, séries, reps, erreurs courantes)
- **Nutrition** : calcul des besoins, plan de repas quotidien
- **Échauffement** : routines générales et spécifiques par jour
- **Récupération** : sommeil, hydratation, étirements
- **Vidéos** : références YouTube pour chaque exercice
- **Progression** : plan sur 9 semaines
- **Suivi** : journal d'entraînement avec historique (localStorage)
- **Liste de courses** : dynamique avec ajout/suppression de catégories et articles
- **Suppléments** : protéine, créatine, oméga-3

## Lancement rapide (Docker)

```bash
docker compose up --build -d
```

L'app est disponible sur **http://localhost**

## Lancement en développement

### Backend

```bash
cd backend
npm install
npm run import   # Génère la base SQLite
npm start        # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

## Structure du projet

```
musculation-app/
├── backend/
│   ├── server.js              # API Express
│   ├── scripts/
│   │   └── import_to_sqlite.js # Import MD → SQLite
│   ├── musculation.db         # Base SQLite (générée)
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Layout principal
│   │   ├── api.js             # Appels API
│   │   └── components/        # 15 composants React
│   ├── nginx.conf             # Config production
│   └── Dockerfile
├── docker-compose.yml
└── plan_musculation.md        # Source des données
```

## Base de données SQLite

31 tables :

| Table | Contenu |
|-------|---------|
| `profile` | Profil utilisateur |
| `workout_days` + `exercises` | Jours et exercices |
| `exercise_steps` | Étapes d'exécution |
| `exercise_errors` | Erreurs courantes |
| `meals` + `meal_items` | Repas et aliments |
| `videos` | Vidéos de référence |
| `schedule` | Planning hebdomadaire |
| `supplements` | Suppléments |
| `golden_rules` | Règles d'or |
| `recovery_*` | Sommeil, hydratation, étirements |
| `warmup_*` | Échauffement |
| `progression` | Progression 9 semaines |
| `tracking_*` | Suivi et pesée |

## Modifier les données

Éditer `plan_musculation.md` puis réimporter :

```bash
cd backend
npm run import
```

## Auteur

Créé le 02/06/2026 — Version 4.0
