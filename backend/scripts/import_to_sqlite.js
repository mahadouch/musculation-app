#!/usr/bin/env node
/**
 * Script d'import du fichier plan_musculation.md vers SQLite
 * Usage: node scripts/import_to_sqlite.js
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'musculation.db');
const MD_PATH = path.join(__dirname, '..', '..', 'plan_musculation.md');

// Supprimer l'ancienne DB si elle existe
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('🗑️  Ancienne base supprimée');
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ============================================================
// CRÉATION DU SCHÉMA
// ============================================================

console.log('📝 Création du schéma...');

db.exec(`
  -- Profil utilisateur
  CREATE TABLE profile (
    id INTEGER PRIMARY KEY DEFAULT 1,
    age TEXT,
    taille TEXT,
    poids TEXT,
    imc TEXT,
    objectif TEXT,
    equipement TEXT,
    niveau TEXT
  );

  -- Objectifs nutritionnels
  CREATE TABLE objectives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parametre TEXT,
    valeur TEXT
  );

  -- Besoins nutritionnels quotidiens
  CREATE TABLE nutrition_needs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nutriment TEXT,
    quantite TEXT,
    source TEXT
  );

  -- Repas
  CREATE TABLE meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    emoji TEXT,
    heure TEXT,
    calories TEXT
  );

  -- Items de chaque repas
  CREATE TABLE meal_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_id INTEGER REFERENCES meals(id),
    item TEXT,
    ordre INTEGER
  );

  -- Jours d'entraînement
  CREATE TABLE workout_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER,
    title TEXT,
    day_name TEXT,
    description TEXT
  );

  -- Exercices
  CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_id INTEGER REFERENCES workout_days(id),
    number INTEGER,
    name TEXT,
    muscles TEXT,
    equipment TEXT,
    reps TEXT,
    sets TEXT,
    rest TEXT,
    duration TEXT,
    full_name TEXT
  );

  -- Étapes d'exécution des exercices
  CREATE TABLE exercise_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER REFERENCES exercises(id),
    step_number INTEGER,
    description TEXT
  );

  -- Erreurs courantes par exercice
  CREATE TABLE exercise_errors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER REFERENCES exercises(id),
    error_text TEXT
  );

  -- Vidéos de référence
  CREATE TABLE videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_name TEXT,
    day_number INTEGER,
    exercise_number INTEGER,
    title TEXT,
    channel TEXT,
    url TEXT
  );

  -- Planning hebdomadaire
  CREATE TABLE schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_name TEXT,
    activity TEXT,
    duration TEXT
  );

  -- Suppléments
  CREATE TABLE supplements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    dosage TEXT,
    utility TEXT
  );

  -- Règles d'or
  CREATE TABLE golden_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule_number INTEGER,
    title TEXT,
    description TEXT
  );

  -- Erreurs à éviter
  CREATE TABLE errors_to_avoid (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    error_number INTEGER,
    description TEXT
  );

  -- Liste de courses par catégorie
  CREATE TABLE shopping_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  );

  CREATE TABLE shopping_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES shopping_categories(id),
    item TEXT,
    checked INTEGER DEFAULT 0
  );

  -- Progression
  CREATE TABLE progression (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weeks TEXT,
    action TEXT
  );

  -- Tracking / Suivi
  CREATE TABLE tracking_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    param TEXT,
    value TEXT
  );

  CREATE TABLE tracking_tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tip_number INTEGER,
    text TEXT
  );

  -- Échauffement général
  CREATE TABLE warmup_general (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise TEXT,
    duration TEXT,
    description TEXT
  );

  -- Échauffement spécifique par jour
  CREATE TABLE warmup_specific_day (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_number INTEGER,
    day_name TEXT
  );

  CREATE TABLE warmup_specific (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_id INTEGER REFERENCES warmup_specific_day(id),
    exercise TEXT,
    series INTEGER,
    reps TEXT,
    objective TEXT
  );

  -- Échauffement cyclisme
  CREATE TABLE warmup_cycling (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    minute_range TEXT,
    intensity TEXT,
    description TEXT
  );

  -- Récupération - Sommeil
  CREATE TABLE recovery_sleep (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    param TEXT,
    recommendation TEXT,
    reason TEXT
  );

  -- Récupération - Hydratation
  CREATE TABLE recovery_hydration (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    moment TEXT,
    quantity TEXT,
    advice TEXT
  );

  -- Récupération - Étirements
  CREATE TABLE recovery_stretches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise TEXT,
    duration TEXT,
    muscles TEXT
  );

  -- Récupération - Signes de surcharge
  CREATE TABLE overtraining_signs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sign TEXT
  );

  -- Récupération active
  CREATE TABLE recovery_active (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity TEXT,
    when_x TEXT,
    duration TEXT,
    benefits TEXT
  );

  -- Nutrition de récupération
  CREATE TABLE recovery_nutrition (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    moment TEXT,
    what TEXT,
    why TEXT
  );

  -- Conseils de progression
  CREATE TABLE progression_tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tip_number INTEGER,
    text TEXT
  );

  -- Entrées de tracking (musculation + cyclisme)
  CREATE TABLE tracking_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('musculation', 'cyclisme')),
    date TEXT NOT NULL,
    day INTEGER,
    weight TEXT,
    mood TEXT,
    energy TEXT,
    notes TEXT,
    exercises_json TEXT,
    duration INTEGER,
    distance REAL,
    intensity TEXT,
    meteo TEXT,
    bpm INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

console.log('✅ Schéma créé');

// ============================================================
// IMPORT DES DONNÉES
// ============================================================

console.log('📥 Import des données...');

// --- PROFIL ---
const insertProfile = db.prepare(`
  INSERT INTO profile (age, taille, poids, imc, objectif, equipement, niveau)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
insertProfile.run('37 ans', '182 cm', '62 kg', '18.7 (sous-poids)', '75-80 kg de muscle sec', 'Haltères + vélo d\'extérieur', 'Débutant');

// --- OBJECTIFS ---
const insertObjective = db.prepare(`INSERT INTO objectives (parametre, valeur) VALUES (?, ?)`);
insertObjective.run('Prise de poids saine', '0.5-1 kg/semaine');
insertObjective.run('Calories journalières', '2500-2800 kcal (surplus de 300-500 kcal)');
insertObjective.run('Protéines', '2g/kg → 124g/jour');
insertObjective.run('Glucides', '4-5g/kg → 248-310g/jour');
insertObjective.run('Lipides', '1g/kg → 62g/jour');

// --- BESOINS NUTRITIONNELS ---
const insertNeed = db.prepare(`INSERT INTO nutrition_needs (nutriment, quantite, source) VALUES (?, ?, ?)`);
insertNeed.run('Calories', '2500-2800 kcal', 'Surplus de 300-500 kcal');
insertNeed.run('Protéines', '124g', '2g/kg de poids corporel');
insertNeed.run('Glucides', '248-310g', '4-5g/kg');
insertNeed.run('Lipides', '62g', '1g/kg');

// --- REPAS ---
const insertMeal = db.prepare(`INSERT INTO meals (name, emoji, heure, calories) VALUES (?, ?, ?, ?)`);
const insertMealItem = db.prepare(`INSERT INTO meal_items (meal_id, item, ordre) VALUES (?, ?, ?)`);

const meals = [
  { name: 'Petit-déjeuner', emoji: '🌅', heure: '7h', calories: '~500 kcal', items: ['4 œufs brouillés', '2 tranches de pain complet', '1 banane', '1 verre de lait (250ml)'] },
  { name: 'Collation matin', emoji: '🥜', heure: '10h', calories: '~300 kcal', items: ['Yaourt nature (150g)', 'Poignée de noix (30g)', '1 fruits de saison'] },
  { name: 'Déjeuner', emoji: '🍽️', heure: '13h', calories: '~600 kcal', items: ['200g de poulet (ou dinde)', '150g de riz (poids cuit)', 'Légumes variés', '1 cuillère d\'huile d\'olive (10g)'] },
  { name: 'Collation après-midi', emoji: '🍌', heure: '16h', calories: '~400 kcal', items: ['2 tartines de pain complet', 'Beurre de cacahuète (2 cuillères)', '1 banane'] },
  { name: 'Dîner', emoji: '🥩', heure: '19h', calories: '~500 kcal', items: ['200g de poisson (ou viande rouge)', '150g de pâtes (ou riz)', 'Légumes verts'] },
  { name: 'Avant le coucher', emoji: '🧀', heure: '21h', calories: '~200 kcal', items: ['Fromage blanc (150g)', 'Noix (20g)'] },
];

const insertMeals = db.transaction(() => {
  for (const meal of meals) {
    const info = insertMeal.run(meal.name, meal.emoji, meal.heure, meal.calories);
    for (let i = 0; i < meal.items.length; i++) {
      insertMealItem.run(info.lastInsertRowid, meal.items[i], i + 1);
    }
  }
});
insertMeals();

// --- JOURS D'ENTRAÎNEMENT ---
const insertDay = db.prepare(`INSERT INTO workout_days (number, title, day_name) VALUES (?, ?, ?)`);

const insertDays = db.transaction(() => {
  insertDay.run(1, 'Haut du corps', 'Lundi');
  insertDay.run(2, 'Bas du corps', 'Mercredi');
  insertDay.run(3, 'Full body', 'Vendredi');
});
insertDays();

// --- EXERCICES ---
const insertEx = db.prepare(`
  INSERT INTO exercises (day_id, number, name, muscles, equipment, reps, sets, rest, duration, full_name)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertStep = db.prepare(`INSERT INTO exercise_steps (exercise_id, step_number, description) VALUES (?, ?, ?)`);
const insertError = db.prepare(`INSERT INTO exercise_errors (exercise_id, error_text) VALUES (?, ?)`);

const day1Exercises = [
  {
    name: 'Développé haltères assis',
    full_name: 'Développé haltères assis (Développé militaire)',
    muscles: 'Épaules (deltoïdes), triceps, trapèzes',
    equipment: '2 haltères, banc droit',
    reps: '10-12', sets: '3', rest: '90 secondes',
    steps: [
      'Assis sur le banc, dos bien droit, pieds à plat au sol',
      'Prends un haltère dans chaque main, paumes face à l\'avant',
      'Positionne les haltères à hauteur des épaules, coudes à 90°',
      'Pousse les haltères vers le haut en les rapprochant légèrement',
      'Descend les coudes jusqu\'à 90° (pas plus bas)',
      'Répète pour chaque série',
    ],
    errors: [
      'Arquer le dos → garde le dos droit contre le banc',
      'Descendre trop bas → s\'arrêter à 90° pour protéger les épaules',
      'Utiliser trop de poids → commence léger pour maîtriser la forme',
    ],
  },
  {
    name: 'Rowing haltère à une main',
    full_name: 'Rowing haltère à une main',
    muscles: 'Grand dorsal (dos), biceps, épaules postérieures',
    equipment: '1 haltère, banc (ou chaise)',
    reps: '10-12', sets: '3', rest: '90 secondes',
    steps: [
      'Pose un genou et la main sur le banc pour te soutenir',
      'Le dos reste parfaitement droit, parallèle au sol',
      'Prends l\'haltère de l\'autre main, bras tendu vers le bas',
      'Tire l\'haltère vers ta hanche en fléchissant le coude',
      'Contracte le dos en haut du mouvement (1 seconde de pause)',
      'Descends lentement le poids (phase excentrique contrôlée)',
    ],
    errors: [
      'Tordre le dos → garde le dos droit tout le long',
      'Tirer avec le biceps → concentre-toi sur le mouvement du dos',
      'Balancer le corps → reste stable, seul le bras bouge',
    ],
  },
  {
    name: 'Écarté haltères couché',
    full_name: 'Écarté haltères couché',
    muscles: 'Pectoraux (grands muscles de la poitrine), deltoïdes antérieurs',
    equipment: '2 haltères, banc plat',
    reps: '12-15', sets: '3', rest: '60 secondes',
    steps: [
      'Allongé sur le banc, pieds à plat au sol',
      'Prends un haltère dans chaque main, paumes face à face',
      'Pousse les haltères vers le haut (bras légèrement fléchis, pas verrouillés)',
      'Ouvre les bras latéralement en descendant les haltères (comme un grand "O")',
      'Descends jusqu\'à sentir un étirement dans la poitrine',
      'Ramène les haltères en position de départ en les rapprochant',
    ],
    errors: [
      'Écarter trop les bras → garde les coudes légèrement fléchis',
      'Utiliser trop de poids → cet exercice est pour l\'isolation, pas la force brute',
      'Toucher les haltères en haut → garde 5-10 cm entre eux',
    ],
  },
  {
    name: 'Curl biceps haltères',
    full_name: 'Curl biceps haltères (debout)',
    muscles: 'Biceps (face du bras)',
    equipment: '2 haltères',
    reps: '12', sets: '3', rest: '60 secondes',
    steps: [
      'Debout, pieds largeur d\'épaules, genoux légèrement fléchis',
      'Prends un haltère dans chaque main, paumes face à l\'avant',
      'Fléchis les coudes en montant les haltères vers les épaules',
      'Contracte les biceps en haut (1 seconde de pause)',
      'Descends lentement (3-4 secondes pour la descente)',
      'Ne balance pas le corps pour tricher',
    ],
    errors: [
      'Balancer le corps → garde le dos droit et les coudes fixés le long du corps',
      'Vitesse → contrôle la descente, c\'est là que le muscle grandit',
      'Tourner les poignets → garde les paumes face à l\'avant',
    ],
  },
  {
    name: 'Extension triceps haltère',
    full_name: 'Extension triceps haltère (derrière la tête)',
    muscles: 'Triceps (face arrière du bras)',
    equipment: '1 haltère',
    reps: '12', sets: '3', rest: '60 secondes',
    steps: [
      'Debout ou assis, prends un haltère à deux mains',
      'Lève le bras au-dessus de la tête, coude proche de l\'oreille',
      'Fléchis le coude pour descendre l\'haltère derrière la tête',
      'Tends le bras pour revenir en position de départ',
      'Contracte les triceps en haut du mouvement',
    ],
    errors: [
      'Écarter les coudes → garde-les serrés près des oreilles',
      'Arquer le dos → serre les abdominaux',
      'Mouvement trop rapide → contrôle le mouvement',
    ],
  },
];

const day2Exercises = [
  {
    name: 'Squat haltères (Goblet Squat)',
    full_name: 'Squat haltères (Goblet Squat)',
    muscles: 'Quadriceps, fessiers, ischio-jambiers',
    equipment: '1 ou 2 haltères',
    reps: '12-15', sets: '3', rest: '90 secondes',
    steps: [
      'Debout, pieds légèrement plus larges que les épaules, pointes de pieds légèrement vers l\'extérieur',
      'Prends l\'haltère contre la poitrine (à deux mains) ou un haltère dans chaque main',
      'Descends comme si tu t\'asseyais sur une chaise (les genoux suivent les pointes de pieds)',
      'Descends jusqu\'à ce que les cuisses soient parallèles au sol (ou plus bas si possible)',
      'Pousse avec les talons pour remonter',
      'Serre les fessiers en haut du mouvement',
    ],
    errors: [
      'Les genoux qui rentrent vers l\'intérieur → pousse-les vers l\'extérieur',
      'Le dos qui se cambre → garde le dos droit, regarde devant',
      'Les talons qui se lèvent → garde les pieds bien ancrés au sol',
    ],
  },
  {
    name: 'Fentes marchées',
    full_name: 'Fentes marchées (ou statiques)',
    muscles: 'Quadriceps, fessiers, ischio-jambiers, équilibre',
    equipment: '2 haltères',
    reps: '10/jambe', sets: '3', rest: '90 secondes',
    steps: [
      'Debout, prends un haltère dans chaque main',
      'Fais un grand pas en avant avec une jambe',
      'Descends le genou arrière vers le sol (sans le toucher)',
      'Pousse avec la jambe avant pour remonter',
      'Alterne les jambes (marche) ou reste au même endroit (statique)',
    ],
    errors: [
      'Le genou avant qui dépasse les orteils → avance le pied pour que le genou reste au-dessus de la cheville',
      'Le dos qui se penche → garde le buste droit',
      'Pas assez profond → le genou arrière doit être proche du sol',
    ],
  },
  {
    name: 'Soulevé de terre jambes tendues',
    full_name: 'Soulevé de terre jambes tendues (Romanian Deadlift)',
    muscles: 'Ischio-jambiers (face arrière des cuisses), fessiers, bas du dos',
    equipment: '2 haltères',
    reps: '12', sets: '3', rest: '90 secondes',
    steps: [
      'Debout, pieds largeur d\'épaules, haltères devant les cuisses',
      'Légère flexion des genoux (pas de squat !)',
      'Penche le buste en avant en poussant les hanches vers l\'arrière',
      'Descends les haltères le long des jambes jusqu\'à sentir un étirement dans les ischio-jambiers',
      'Remonte en contractant les fessiers et les ischio-jambiers',
      'Le dos reste toujours droit !',
    ],
    errors: [
      'Arrondir le dos → le dos reste plat tout le long du mouvement',
      'Plier trop les genoux → garde-les légèrement fléchis, ne descends pas en squat',
      'Aller trop bas → descends jusqu\'à la limite de ton étirement, pas plus',
    ],
  },
  {
    name: 'Mollets debout',
    full_name: 'Mollets debout',
    muscles: 'Mollets (gastrocnémiens)',
    equipment: '2 haltères',
    reps: '15-20', sets: '3', rest: '60 secondes',
    steps: [
      'Debout, pieds à plat, un haltère dans chaque main',
      'Monte sur la pointe des pieds en contractant les mollets',
      'Maintiens en haut 2 secondes',
      'Descends lentement (3 secondes) jusqu\'à sentir un étirement',
    ],
    errors: [
      'Mouvement trop rapide → contrôle la montée ET la descente',
      'Ne pas aller en bas → sens l\'étirement en bas pour recruter plus de fibres',
    ],
  },
  {
    name: 'Gainage (Planche)',
    full_name: 'Gainage (Planche)',
    muscles: 'Abdominaux profonds (transverse), dos, épaules',
    equipment: 'Aucun',
    reps: '', sets: '3', rest: '60 secondes', duration: '30-45 secondes',
    steps: [
      'Sur les avant-bras, coudes sous les épaules',
      'Corps en ligne droite de la tête aux pieds (comme une planche de bois !)',
      'Serre les abdominaux comme si tu allais recevoir un coup dans le ventre',
      'Ne laisse pas le bassin tomber ni le dos se cambrer',
      'Respire normalement (ne retiens pas ton souffle !)',
    ],
    errors: [
      'Le bassin qui tombe → serre les fessiers et les abdominaux',
      'Le dos qui se cambre → garde le corps en ligne droite',
      'Retenir son souffle → respire calmement',
    ],
  },
];

const day3Exercises = [
  {
    name: 'Thruster haltères',
    full_name: 'Thruster haltères (Squat + Développé)',
    muscles: 'Quadriceps, fessiers, épaules, triceps, core',
    equipment: '2 haltères',
    reps: '10', sets: '3', rest: '90 secondes',
    steps: [
      'Debout, haltères au niveau des épaules, paumes face à l\'intérieur',
      'Fais un squat complet (comme le goblet squat)',
      'En remontant, pousse les haltères vers le haut en une seule fluidité',
      'Le mouvement doit être continu : squat → press d\'un seul élan',
      'Redescends les haltères aux épaules et recommence',
    ],
    errors: [
      'Mouvement en deux temps → c\'est un mouvement fluide, pas un squat puis un press',
      'Perdre l\'équilibre → garde les pieds bien ancrés',
      'Arquer le dos → serre les abdominaux pendant tout le mouvement',
    ],
  },
  {
    name: 'Rowing haltère',
    full_name: 'Rowing haltère (comme Jour 1)',
    muscles: 'Grand dorsal, biceps, épaules postérieures',
    equipment: '1 haltère, banc',
    reps: '10', sets: '3', rest: '90 secondes',
    steps: [], errors: [],
  },
  {
    name: 'Squat haltères',
    full_name: 'Squat haltères (comme Jour 2)',
    muscles: 'Quadriceps, fessiers, ischio-jambiers',
    equipment: '1 ou 2 haltères',
    reps: '12', sets: '3', rest: '90 secondes',
    steps: [], errors: [],
  },
  {
    name: 'Développé haltères couché',
    full_name: 'Développé haltères couché (comme Jour 1)',
    muscles: 'Pectoraux, deltoïdes antérieurs, triceps',
    equipment: '2 haltères, banc plat',
    reps: '10', sets: '3', rest: '90 secondes',
    steps: [], errors: [],
  },
  {
    name: 'Planche',
    full_name: 'Planche (comme Jour 2)',
    muscles: 'Abdominaux profonds, dos, épaules',
    equipment: 'Aucun',
    reps: '', sets: '3', rest: '60 secondes', duration: '30-45 secondes',
    steps: [], errors: [],
  },
];

const allDays = { 1: day1Exercises, 2: day2Exercises, 3: day3Exercises };

const insertExercises = db.transaction(() => {
  for (const [dayNum, exercises] of Object.entries(allDays)) {
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      const info = insertEx.run(
        parseInt(dayNum), i + 1, ex.name, ex.muscles, ex.equipment,
        ex.reps || null, ex.sets, ex.rest, ex.duration || null, ex.full_name
      );
      const exId = info.lastInsertRowid;
      for (let s = 0; s < ex.steps.length; s++) {
        insertStep.run(exId, s + 1, ex.steps[s]);
      }
      for (const err of ex.errors) {
        insertError.run(exId, err);
      }
    }
  }
});
insertExercises();

// --- VIDÉOS ---
const insertVideo = db.prepare(`
  INSERT INTO videos (exercise_name, day_number, exercise_number, title, channel, url)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const videosData = [
  ['Développé haltères assis', 1, 1, 'How to do the SEATED DUMBBELL SHOULDER PRESS!', 'Max Euceda', 'https://www.youtube.com/watch?v=rO_iEImwHyo'],
  ['Rowing haltère à une main', 1, 2, 'STOP F*cking Up Dumbbell Rows (PROPER FORM!)', 'ATHLEAN-X™', 'https://www.youtube.com/watch?v=gfUg6qWohTk'],
  ['Écarté haltères couché', 1, 3, 'Dumbbell Flyes: The Right Way & The Wrong Way', 'ATHLEAN-X™', 'https://www.youtube.com/watch?v=eozdVDA78K0'],
  ['Curl biceps', 1, 4, 'Bicep Curls: The Best Way (SET THE RECORD STRAIGHT!)', 'ATHLEAN-X™', 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo'],
  ['Extension triceps', 1, 5, 'Tricep Extensions: Best & Worst Exercises', 'ATHLEAN-X™', 'https://www.youtube.com/watch?v=6TSP1J3yC5g'],
  ['Goblet Squat', 2, 1, 'Goblet Squat: The Best Exercise You\'re Not Doing!', 'ATHLEAN-X™', 'https://www.youtube.com/watch?v=MeIqId7AFlw'],
  ['Fentes marchées', 2, 2, 'How To Lunge (3 Mistakes You\'re Making!)', 'ATHLEAN-X™', 'https://www.youtube.com/watch?v=L8fvypPHRoA'],
  ['Soulevé de terre jambes tendues', 2, 3, 'Romanian Deadlift: Perfect Form Tutorial', 'ATHLEAN-X™', 'https://www.youtube.com/watch?v=_oyxCn2iSjU'],
  ['Mollets debout', 2, 4, 'Calf Raises: The Best Exercise for Bigger Calves', 'ATHLEAN-X™', 'https://www.youtube.com/watch?v=-VoKAb8NDkM'],
  ['Gainage/Planche', 2, 5, 'How To Plank: Perfect Form', 'ATHLEAN-X™', 'https://www.youtube.com/watch?v=pvDjs9rn3hU'],
  ['Thruster haltères', 3, 1, 'Dumbbell Thruster: How To Do It Correctly', 'WODprep', 'https://www.youtube.com/watch?v=sZ8gGcQ2KxQ'],
];

const insertVideos = db.transaction(() => {
  for (const v of videosData) {
    insertVideo.run(...v);
  }
});
insertVideos();

// --- PLANNING ---
const insertSchedule = db.prepare(`INSERT INTO schedule (day_name, activity, duration) VALUES (?, ?, ?)`);
const scheduleData = [
  ['Lundi', 'Musculation - Haut du corps', '45-60 min'],
  ['Mardi', 'Cyclisme', '30-45 min'],
  ['Mercredi', 'Musculation - Bas du corps', '45-60 min'],
  ['Jeudi', 'Repos ou cyclisme léger', '30 min'],
  ['Vendredi', 'Musculation - Full body', '45-60 min'],
  ['Samedi', 'Repos ou cyclisme', '30-45 min'],
  ['Dimanche', 'Repos complet', '-'],
];
const insertScheduleData = db.transaction(() => {
  for (const s of scheduleData) insertSchedule.run(...s);
});
insertScheduleData();

// --- SUPPLÉMENTS ---
const insertSupp = db.prepare(`INSERT INTO supplements (name, dosage, utility) VALUES (?, ?, ?)`);
insertSupp.run('Protéine en poudre', '1-2 scoops/jour', 'Faciliter l\'apport en protéines');
insertSupp.run('Créatine', '3-5g/jour', 'Augmenter la force et la masse');
insertSupp.run('Multivitamines', '1/jour', 'Couvrir les carences');
insertSupp.run('Oméga-3', '1-2g/jour', 'Réduire l\'inflammation');

// --- RÈGLES D'OR ---
const insertRule = db.prepare(`INSERT INTO golden_rules (rule_number, title, description) VALUES (?, ?, ?)`);
insertRule.run(1, 'La forme avant le poids', 'Maîtrise chaque mouvement avec un poids léger avant d\'augmenter');
insertRule.run(2, 'La respiration', 'Expire à l\'effort (montée), inspire à la descente. Ne retiens JAMAIS ton souffle');
insertRule.run(3, 'La connexion muscle-cerveau', 'Pense au muscle que tu travailles. Si tu fais des curls biceps, concentre-toi sur le biceps');
insertRule.run(4, 'Le tempo contrôlé', '2 secondes pour monter, 1 seconde de pause en haut, 3 secondes pour descendre');
insertRule.run(5, 'L\'amplitude complète', 'Fais le mouvement complet, pas à moitié. L\'amplitude = meilleurs résultats');

// --- ERREURS À ÉVITER ---
const insertErr = db.prepare(`INSERT INTO errors_to_avoid (error_number, description) VALUES (?, ?)`);
insertErr.run(1, 'Manger trop peu : C\'est la cause n°1 de l\'échec en prise de poids');
insertErr.run(2, 'Sauter des repas : L\'alimentation régulière est essentielle');
insertErr.run(3, 'Trop de cardio : Le vélo est bon, mais pas trop intense sinon tu brûles tes calories');
insertErr.run(4, 'Négliger les protéines : Elles construisent le muscle');
insertErr.run(5, 'Manquer de sommeil : Le muscle se repose et grandit pendant le sommeil');
insertErr.run(6, 'Être impatient : La prise de poids saine prend du temps, sois constant');

// --- LISTE DE COURSES ---
const insertCat = db.prepare(`INSERT INTO shopping_categories (name) VALUES (?)`);
const insertItem = db.prepare(`INSERT INTO shopping_items (category_id, item) VALUES (?, ?)`);

const shoppingData = {
  'Protéines': ['Poulet/dinde (1.5 kg)', 'Œufs (2 douzaines)', 'Poisson (1 kg)', 'Fromage blanc (500g)'],
  'Glucides': ['Riz (1 kg)', 'Pâtes (500g)', 'Pain complet (2 packs)', 'Flocons d\'avoine (500g)'],
  'Légumes/Fruits': ['Bananes (1 bunch)', 'Légumes variés', 'Fruits de saison'],
  'Lipides': ['Huile d\'olive (1 bouteille)', 'Beurre de cacahuète (1 pot)', 'Noix/amandes (200g)'],
  'Laitiers': ['Lait (2L)', 'Yaourts nature (6)'],
};

const insertShopping = db.transaction(() => {
  for (const [cat, items] of Object.entries(shoppingData)) {
    const catInfo = insertCat.run(cat);
    for (const item of items) {
      insertItem.run(catInfo.lastInsertRowid, item);
    }
  }
});
insertShopping();

// --- PROGRESSION ---
const insertProg = db.prepare(`INSERT INTO progression (weeks, action) VALUES (?, ?)`);
insertProg.run('1-2', 'Apprendre les mouvements, formes correctes');
insertProg.run('3-4', 'Augmenter les reps si c\'est trop facile');
insertProg.run('5-6', 'Augmenter le poids des haltères');
insertProg.run('7-8', 'Ajouter 1 série par exercice');
insertProg.run('9+', 'Envisager d\'acheter des haltères plus lourds');

// --- TRACKING ---
const insertTrack = db.prepare(`INSERT INTO tracking_config (param, value) VALUES (?, ?)`);
insertTrack.run('Fréquence pesée', '1x/semaine');
insertTrack.run('Moment pesée', 'Le matin, à jeun, après être allé aux toilettes');
insertTrack.run('Objectif pesée', '+0.5-1 kg/semaine');

const insertTip = db.prepare(`INSERT INTO tracking_tips (tip_number, text) VALUES (?, ?)`);
insertTip.run(1, 'Soyez honnête — Écris ce que tu as VRAIMENT fait');
insertTip.run(2, 'Soyez régulier — Remplis le journal à CHAQUE séance');
insertTip.run(3, 'Note les émotions — Énergie, motivation, stress...');
insertTip.run(4, 'Revois chaque semaine — Compare tes performances');
insertTip.run(5, 'Ajuste — Si c\'est trop facile, augmente le poids');

// --- ÉCHAUFFEMENT GÉNÉRAL ---
const insertWarmupGen = db.prepare(`INSERT INTO warmup_general (exercise, duration, description) VALUES (?, ?, ?)`);
insertWarmupGen.run('Marche rapide', '2-3 min', 'Marche sur place ou dans la pièce, genoux hauts');
insertWarmupGen.run('Rotations des bras', '30s/bras', 'Bras tendus, fais des cercles vers l\'avant puis l\'arrière');
insertWarmupGen.run('Rotations des hanches', '30s/sens', 'Mains sur les hanches, cercles larges');
insertWarmupGen.run('Montées de genoux', '30s', 'Monte les genoux à hauteur de hanche en marchant sur place');
insertWarmupGen.run('Foulées fessiers', '30s', 'Talons aux fessiers en marchant sur place');
insertWarmupGen.run('Jumping jacks légers', '30s', 'Version basse impact si tu es débutant');

// --- ÉCHAUFFEMENT SPÉCIFIQUE ---
const insertWarmupDay = db.prepare(`INSERT INTO warmup_specific_day (day_number, day_name) VALUES (?, ?)`);
const insertWarmupSpec = db.prepare(`INSERT INTO warmup_specific (day_id, exercise, series, reps, objective) VALUES (?, ?, ?, ?, ?)`);

const warmupDays = [
  { day_number: 1, day_name: 'Haut du corps', exercises: [
    ['Pompes sur les genoux', 2, '10', 'Activer les pectoraux et triceps'],
    ['Rotations d\'épaules', 2, '10/sens', 'Mobilité des épaules'],
    ['Rowing léger avec haltère', 2, '12', 'Activer le dos'],
    ['Rotations des poignets', 1, '30s', 'Protéger les articulations'],
  ]},
  { day_number: 2, day_name: 'Bas du corps', exercises: [
    ['Squats sans poids', 2, '15', 'Activer les quadriceps et fessiers'],
    ['Fentes statiques', 2, '10/jambe', 'Préparer les hanches'],
    ['Montées de genoux', 2, '20', 'Activer les ischio-jambiers'],
    ['Rotations de chevilles', 1, '30s/sens', 'Mobilité des chevilles'],
  ]},
  { day_number: 3, day_name: 'Full body', exercises: [
    ['Squats + bras en l\'air', 2, '10', 'Combinaison bas/haut du corps'],
    ['Rowing léger', 2, '12', 'Activer le dos'],
    ['Planche légère', 2, '20s', 'Activer le core'],
    ['Rotations du tronc', 1, '30s', 'Mobilité du dos'],
  ]},
];

const insertWarmupData = db.transaction(() => {
  for (const day of warmupDays) {
    const dayInfo = insertWarmupDay.run(day.day_number, day.day_name);
    for (const ex of day.exercises) {
      insertWarmupSpec.run(dayInfo.lastInsertRowid, ...ex);
    }
  }
});
insertWarmupData();

// --- ÉCHAUFFEMENT CYCLISME ---
const insertCycling = db.prepare(`INSERT INTO warmup_cycling (minute_range, intensity, description) VALUES (?, ?, ?)`);
insertCycling.run('1-2', 'Très légère', 'Pedaler lentement, debout si possible');
insertCycling.run('3-4', 'Légère', 'Augmente progressivement la vitesse');
insertCycling.run('5', 'Modérée', 'Vitesse normale pour commencer la séance');

// --- RÉCUPÉRATION ---
// Sommeil
const insertSleep = db.prepare(`INSERT INTO recovery_sleep (param, recommendation, reason) VALUES (?, ?, ?)`);
insertSleep.run('Durée', '7-9 heures/nuit', 'Les hormones de croissance sont sécrétées pendant le sommeil profond');
insertSleep.run('Régularité', 'Coucher/lever à heures fixes', 'Régule le cycle circadien et améliore la qualité');
insertSleep.run('Environnement', 'Chambre sombre, fraîche, silencieuse', 'Améliore le sommeil profond');
insertSleep.run('Écrans', 'Pas d\'écrans 1h avant le coucher', 'La lumière bleue perturbe la production de mélatonine');

// Hydratation
const insertHydro = db.prepare(`INSERT INTO recovery_hydration (moment, quantity, advice) VALUES (?, ?, ?)`);
insertHydro.run('Au réveil', '500ml d\'eau', 'Réhydrate après 7-8h sans boire');
insertHydro.run('Pendant l\'entraînement', '200-300ml toutes les 15 min', 'Ne bois pas trop d\'un coup, petits gorgées');
insertHydro.run('Après l\'entraînement', '500ml-1L', 'Réhydrate et aide à la récupération');
insertHydro.run('Pendant la journée', '2-3L au total', 'L\'eau est essentielle pour la récupération musculaire');

// Étirements
const insertStretch = db.prepare(`INSERT INTO recovery_stretches (exercise, duration, muscles) VALUES (?, ?, ?)`);
insertStretch.run('Étirement des quadriceps', '30s/jambe', 'Face de la cuisse');
insertStretch.run('Étirement des ischio-jambiers', '30s/jambe', 'Derrière de la cuisse');
insertStretch.run('Étirement des fessiers', '30s/côté', 'Fessiers et hanches');
insertStretch.run('Étirement des pectoraux', '30s', 'Poitrine et épaules');
insertStretch.run('Étirement des dorsaux', '30s', 'Dos');
insertStretch.run('Étirement des mollets', '30s/jambe', 'Mollets');

// Signes de surcharge
const insertOvertrain = db.prepare(`INSERT INTO overtraining_signs (sign) VALUES (?)`);
insertOvertrain.run('Fatigue excessive malgré un bon sommeil');
insertOvertrain.run('Douleurs musculaires qui durent plus de 72h');
insertOvertrain.run('Baisse de performance (tu fais moins que d\'habitude)');
insertOvertrain.run('Perte de motivation ou irritabilité');
insertOvertrain.run('Blessures ou douleurs articulaires');
insertOvertrain.run('Maladies fréquentes (système immunitaire affaibli)');

// Récupération active
const insertActive = db.prepare(`INSERT INTO recovery_active (activity, when_x, duration, benefits) VALUES (?, ?, ?, ?)`);
insertActive.run('Marche légère', 'Jours de repos', '20-30 min', 'Active la circulation sanguine');
insertActive.run('Natation', '1x/semaine optionnel', '30 min', 'Récupération sans impact');
insertActive.run('Yoga/stretching', '2-3x/semaine', '15-30 min', 'Souplesse et récupération');
insertActive.run('Mousse de roulement', 'Après séance', '10-15 min', 'Décompacte les muscles');

// Nutrition de récupération
const insertRecovNut = db.prepare(`INSERT INTO recovery_nutrition (moment, what, why) VALUES (?, ?, ?)`);
insertRecovNut.run('Pendant l\'entraînement', 'Eau', 'Hydratation');
insertRecovNut.run('Dans les 30 min après', 'Collation protéinée (shake, yaourt)', 'Démarre la récupération musculaire');
insertRecovNut.run('Dans les 2h après', 'Repas complet (protéines + glucides)', 'Reconstitue les réserves d\'énergie');
insertRecovNut.run('Le soir', 'Repas riche en protéines', 'Réparation musculaire pendant le sommeil');

// --- CONSEILS DE PROGRESSION ---
const insertProgTip = db.prepare(`INSERT INTO progression_tips (tip_number, text) VALUES (?, ?)`);
insertProgTip.run(1, 'Forme avant poids : Maîtrise bien les mouvements avant d\'augmenter');
insertProgTip.run(2, 'Repos : 48h minimum entre chaque séance pour le même groupe musculaire');
insertProgTip.run(3, 'Sommeil : 7-8h minimum (c\'est là que les muscles grandissent !)');
insertProgTip.run(4, 'Hydratation : 2-3L d\'eau par jour');
insertProgTip.run(5, 'Régularité : La constance est la clé, pas l\'intensité');

// ============================================================
// VÉRIFICATION
// ============================================================

console.log('\n📊 Vérification de la base de données :');
const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`).all();
for (const t of tables) {
  const count = db.prepare(`SELECT COUNT(*) as count FROM ${t.name}`).get().count;
  console.log(`  ${t.name}: ${count} lignes`);
}

db.close();
console.log(`\n✅ Base créée avec succès: ${DB_PATH}`);
