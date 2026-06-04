const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Ouvrir la base SQLite
const db = new Database(path.join(__dirname, '..', 'musculation.db'));
db.pragma('journal_mode = WAL');

// ============================================================
// API : Programme complet (remplace l'ancien parsing du markdown)
// ============================================================
app.get('/api/program', (req, res) => {
  try {
    const program = {
      profile: getProfile(),
      objectives: getObjectives(),
      days: getWorkoutDays(),
      nutrition: getNutrition(),
      recovery: getRecovery(),
      warmup: getWarmup(),
      schedule: getSchedule(),
      supplements: getSupplements(),
      goldenRules: getGoldenRules(),
      errorsToAvoid: getErrorsToAvoid(),
      shoppingList: getShoppingList(),
      videos: getVideos(),
      progression: getProgression(),
      tracking: getTracking(),
    };
    res.json(program);
  } catch (err) {
    console.error('Erreur API program:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================================
// API : Raw markdown (conservée pour compatibilité)
// ============================================================
app.get('/api/markdown', (req, res) => {
  const filePath = path.join(__dirname, '..', '..', 'plan_musculation.md');
  const fs = require('fs');
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ content });
  } catch (err) {
    res.status(404).json({ error: 'Fichier plan_musculation.md non trouvé' });
  }
});

// ============================================================
// FONCTIONS DE LECTURE SQLITE
// ============================================================

function getProfile() {
  return db.prepare('SELECT age, taille, poids, imc, objectif, equipement, niveau FROM profile WHERE id = 1').get();
}

function getObjectives() {
  const rows = db.prepare('SELECT parametre, valeur FROM objectives').all();
  const obj = {};
  for (const row of rows) {
    const key = row.parametre.toLowerCase().replace(/[^a-z]/g, '_').replace(/^_+|_+$/g, '');
    obj[key] = row.valeur;
  }
  return {
    prise_de_poids: obj['prise_de_poids_saine'] || '0.5-1 kg/semaine',
    calories: obj['calories_journalieres'] || '2500-2800 kcal (surplus de 300-500 kcal)',
    proteines: obj['protéines'] || obj['proteines'] || '2g/kg → 124g/jour',
    glucides: obj['glucides'] || '4-5g/kg → 248-310g/jour',
    lipides: obj['lipides'] || '1g/kg → 62g/jour',
  };
}

function getWorkoutDays() {
  const days = db.prepare('SELECT id, number, title, day_name FROM workout_days ORDER BY number').all();

  return days.map(day => {
    const exercises = db.prepare(`
      SELECT id, number, name, muscles, equipment, reps, sets, rest, duration, full_name
      FROM exercises WHERE day_id = ? ORDER BY number
    `).all(day.id);

    const enrichedExercises = exercises.map(ex => {
      const steps = db.prepare(`
        SELECT step_number, description FROM exercise_steps WHERE exercise_id = ? ORDER BY step_number
      `).all(ex.id);

      const errors = db.prepare(`
        SELECT error_text FROM exercise_errors WHERE exercise_id = ?
      `).all(ex.id);

      const video = db.prepare(`
        SELECT title, url FROM videos WHERE day_number = ? AND exercise_number = ?
      `).get(day.number, ex.number);

      return {
        number: ex.number,
        name: ex.name,
        muscles: ex.muscles || '',
        equipment: ex.equipment || '',
        execution: steps.map(s => s.description),
        reps: ex.reps || ex.duration || '',
        sets: ex.sets || '',
        rest: ex.rest || '',
        errors: errors.map(e => e.error_text),
        video: video || null,
      };
    });

    return {
      number: day.number,
      title: day.title,
      exercises: enrichedExercises,
    };
  });
}

function getNutrition() {
  const needs = db.prepare('SELECT nutriment, quantite FROM nutrition_needs').all();
  const dailyNeeds = {};
  for (const n of needs) {
    dailyNeeds[n.nutriment.toLowerCase()] = n.quantite;
  }

  const mealsRaw = db.prepare('SELECT id, name, emoji, heure, calories FROM meals ORDER BY id').all();
  const meals = mealsRaw.map(m => {
    const items = db.prepare('SELECT item FROM meal_items WHERE meal_id = ? ORDER BY ordre').all(m.id);
    return {
      name: `${m.emoji} ${m.name} (${m.heure}) - ${m.calories}`,
      items: items.map(i => i.item),
    };
  });

  return { dailyNeeds, meals };
}

function getRecovery() {
  const sleep = db.prepare('SELECT param, recommendation, reason FROM recovery_sleep').all();
  const hydration = db.prepare('SELECT moment, quantity, advice FROM recovery_hydration').all();
  const stretches = db.prepare('SELECT exercise, duration, muscles FROM recovery_stretches').all();
  const overtrainingSigns = db.prepare('SELECT sign FROM overtraining_signs').all();

  return {
    sleep: sleep.map(s => ({ param: s.param, value: s.recommendation, reason: s.reason })),
    hydration: hydration.map(h => ({ moment: h.moment, quantity: h.quantity, advice: h.advice })),
    stretches: stretches.map(s => ({ exercise: s.exercise, duration: s.duration, muscles: s.muscles })),
    overtrainingSigns: overtrainingSigns.map(s => s.sign),
  };
}

function getWarmup() {
  const general = db.prepare('SELECT exercise, duration, description FROM warmup_general ORDER BY id').all();

  const days = db.prepare('SELECT id, day_number, day_name FROM warmup_specific_day ORDER BY day_number').all();
  const specific = {};
  for (const day of days) {
    const exercises = db.prepare('SELECT exercise, series, reps, objective FROM warmup_specific WHERE day_id = ? ORDER BY id').all(day.id);
    const key = `day${day.day_number}`;
    specific[key] = exercises.map(e => ({
      exercise: e.exercise,
      series: e.series,
      reps: e.reps,
      objective: e.objective,
    }));
  }

  const cycling = db.prepare('SELECT minute_range, intensity, description FROM warmup_cycling ORDER BY id').all();

  return {
    general: general.map(g => ({ exercise: g.exercise, duration: g.duration, description: g.description })),
    specific,
    cycling: cycling.map(c => ({ minute: c.minute_range, intensity: c.intensity, description: c.description })),
  };
}

function getSchedule() {
  return db.prepare('SELECT day_name as day, activity, duration FROM schedule ORDER BY id').all();
}

function getSupplements() {
  return db.prepare('SELECT name, dosage, utility FROM supplements ORDER BY id').all();
}

function getGoldenRules() {
  return db.prepare('SELECT title as rule, description FROM golden_rules ORDER BY rule_number').all();
}

function getErrorsToAvoid() {
  return db.prepare('SELECT description FROM errors_to_avoid ORDER BY error_number').all().map(e => e.description);
}

function getShoppingList() {
  const categories = db.prepare('SELECT id, name FROM shopping_categories ORDER BY id').all();
  const result = {};

  const keyMap = {
    'Protéines': 'proteins',
    'Glucides': 'glucides',
    'Légumes/Fruits': 'legumes',
    'Lipides': 'lipides',
    'Laitiers': 'dairy',
  };

  for (const cat of categories) {
    const items = db.prepare('SELECT item FROM shopping_items WHERE category_id = ? ORDER BY id').all(cat.id);
    const key = keyMap[cat.name] || cat.name.toLowerCase();
    result[key] = items.map(i => i.item);
  }

  return result;
}

function getVideos() {
  const videos = db.prepare('SELECT day_number, exercise_name, title, channel, url FROM videos ORDER BY day_number, id').all();
  const grouped = {};

  for (const v of videos) {
    const key = `day${v.day_number}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({
      exercise: v.exercise_name,
      title: v.title,
      channel: v.channel,
      url: v.url,
    });
  }

  grouped.warmup = 'https://www.youtube.com/watch?v=QOVaHwm-Q6U';
  grouped.stretching = 'https://www.youtube.com/watch?v=g_tea8ZNk5A';

  return grouped;
}

function getProgression() {
  return db.prepare('SELECT weeks as week, action FROM progression ORDER BY id').all();
}

function getTracking() {
  const config = db.prepare('SELECT param, value FROM tracking_config').all();
  const tips = db.prepare('SELECT text FROM tracking_tips ORDER BY tip_number').all();

  const weighing = {};
  for (const c of config) {
    const param = c.param.toLowerCase();
    if (param.includes('fréquence')) weighing.frequency = c.value;
    else if (param.includes('moment')) weighing.moment = c.value;
    else if (param.includes('objectif')) weighing.objective = c.value;
  }

  return {
    weighing,
    tips: tips.map(t => t.text),
  };
}

// ============================================================
// DÉMARRAGE
// ============================================================
app.listen(PORT, () => {
  console.log(`🏋️ API Musculation (SQLite) running on http://localhost:${PORT}`);
});
