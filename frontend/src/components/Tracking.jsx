import { useState, useEffect } from 'react';

const STORAGE_KEY = 'musculation_journal';

const defaultExercises = {
  1: [
    { name: 'Développé couché haltères', sets: 3, reps: '8-10' },
    { name: 'Rowing haltère', sets: 3, reps: '8-10' },
    { name: 'Développé militaire', sets: 3, reps: '8-10' },
    { name: 'Tirage poulie haute', sets: 3, reps: '10-12' },
    { name: 'Écarté poulie', sets: 3, reps: '12-15' },
    { name: 'Bicep curl haltères', sets: 3, reps: '10-12' },
  ],
  2: [
    { name: 'Squat barre', sets: 3, reps: '8-10' },
    { name: 'Soulevé de terre roumain', sets: 3, reps: '8-10' },
    { name: 'Fentes haltères', sets: 3, reps: '10-12 chaque jambe' },
    { name: 'Presse à cuisses', sets: 3, reps: '10-12' },
    { name: 'Leg curl', sets: 3, reps: '12-15' },
    { name: 'Mollets debout', sets: 3, reps: '15-20' },
  ],
  3: [
    { name: 'Développé couché barre', sets: 3, reps: '8-10' },
    { name: 'Tirage horizontal', sets: 3, reps: '8-10' },
    { name: 'Squat goblet', sets: 3, reps: '10-12' },
    { name: 'Planche gainage', sets: 3, reps: '30-60 sec' },
    { name: 'Gainage latéral', sets: 3, reps: '20-30 sec chaque côté' },
    { name: 'Relevé de jambes suspendu', sets: 3, reps: '10-15' },
  ],
};

const dayLabels = {
  1: 'JOUR 1 — Haut du corps',
  2: 'JOUR 2 — Bas du corps',
  3: 'JOUR 3 — Full body',
};

const intensityOptions = ['Légère', 'Modérée', 'Intense'];
const weatherOptions = [
  { label: '☀️ Ensoleillé', value: 'Ensoleillé' },
  { label: '☁️ Nuageux', value: 'Nuageux' },
  { label: '🌧️ Pluie', value: 'Pluie' },
  { label: '💨 Vent', value: 'Vent' },
];

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function Tracking({ data }) {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('journal'); // journal | history | stats
  const [sessionType, setSessionType] = useState('musculation'); // musculation | cyclisme
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    day: 1,
    weight: '',
    exercises: [],
    mood: '😐',
    energy: 'Moyenne',
    notes: '',
    // Cycling fields
    duration: '',
    distance: '',
    intensity: 'Modérée',
    meteo: 'Ensoleillé',
    bpm: '',
  });

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const initExercises = (day) => {
    const exos = defaultExercises[day] || defaultExercises[1];
    setForm(f => ({
      ...f,
      day,
      exercises: exos.map(e => ({
        ...e,
        weight: '',
        repsDone: e.reps,
        setsDone: e.sets,
        completed: false,
      })),
    }));
  };

  const handleDayChange = (day) => {
    initExercises(day);
  };

  const updateExercise = (index, field, value) => {
    setForm(f => {
      const exos = [...f.exercises];
      exos[index] = { ...exos[index], [field]: value };
      return { ...f, exercises: exos };
    });
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      day: 1,
      weight: '',
      exercises: [],
      mood: '😐',
      energy: 'Moyenne',
      notes: '',
      duration: '',
      distance: '',
      intensity: 'Modérée',
      meteo: 'Ensoleillé',
      bpm: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.weight) {
      alert('Entre ton poids du jour');
      return;
    }
    const entry = {
      id: Date.now(),
      type: sessionType,
      ...form,
      timestamp: new Date().toISOString(),
    };
    const newEntries = [entry, ...entries];
    setEntries(newEntries);
    saveEntries(newEntries);
    setShowForm(false);
    resetForm();
  };

  const deleteEntry = (id) => {
    if (confirm('Supprimer cette entrée ?')) {
      const newEntries = entries.filter(e => e.id !== id);
      setEntries(newEntries);
      saveEntries(newEntries);
    }
  };

  const completedCount = (exercises) =>
    exercises.filter(e => e.completed).length;

  // Split entries by type
  const muscEntries = entries.filter(e => e.type !== 'cyclisme');
  const cycEntries = entries.filter(e => e.type === 'cyclisme');
  const totalSessions = entries.length;

  // Stats (musculation)
  const firstEntry = muscEntries[muscEntries.length - 1];
  const lastEntry = muscEntries[0];
  const weightStart = firstEntry ? parseFloat(firstEntry.weight) : 0;
  const weightEnd = lastEntry ? parseFloat(lastEntry.weight) : 0;
  const weightDiff = weightEnd - weightStart;
  const avgMood = entries.length > 0
    ? entries.reduce((sum, e) => {
        const moods = { '😊': 5, '🙂': 4, '😐': 3, '😟': 2, '😫': 1 };
        return sum + (moods[e.mood] || 3);
      }, 0) / entries.length
    : 0;

  // Cycling stats
  const cycTotalKm = cycEntries.reduce((sum, e) => sum + (parseFloat(e.distance) || 0), 0);
  const cycTotalMin = cycEntries.reduce((sum, e) => sum + (parseInt(e.duration) || 0), 0);
  const cycAvgDuration = cycEntries.length > 0 ? Math.round(cycTotalMin / cycEntries.length) : 0;

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1px solid #2a2a40', background: '#12121a',
    color: 'white', fontSize: '1rem', fontFamily: 'inherit',
  };

  const labelStyle = { color: '#a0a0b8', fontSize: '0.85rem', display: 'block', marginBottom: 6 };

  return (
    <>
      <h2 className="section-title">
        <span className="icon">📓</span> JOURNAL D'ENTRAÎNEMENT
      </h2>

      {/* Tips */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="emoji">💡</span>
          <h3>Conseils pour le journal</h3>
        </div>
        {data.tips.map((tip, i) => (
          <div key={i} style={{
            padding: '8px 0',
            borderBottom: i < data.tips.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <span style={{
              background: 'rgba(233, 69, 96, 0.2)', color: '#ff6b81',
              width: 24, height: 24, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
            }}>{i + 1}</span>
            <span style={{ color: '#a0a0b8', fontSize: '0.9rem' }}>{tip}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="day-tabs">
        <button className={`day-tab ${activeTab === 'journal' ? 'active' : ''}`}
          onClick={() => setActiveTab('journal')}>📝 Nouvelle séance</button>
        <button className={`day-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}>📋 Historique ({entries.length})</button>
        <button className={`day-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}>📊 Statistiques</button>
      </div>

      {/* ====== NEW ENTRY FORM ====== */}
      {activeTab === 'journal' && (
        <>
          {!showForm ? (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ fontSize: '1.1rem', color: '#a0a0b8', marginBottom: 20 }}>
                {totalSessions === 0
                  ? "Tu n'as pas encore d'entrées. Commence ton journal !"
                  : `Tu as ${totalSessions} séance${totalSessions > 1 ? 's' : ''} enregistrée${totalSessions > 1 ? 's' : ''}.`}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => { setSessionType('musculation'); initExercises(1); setShowForm(true); }}
                  style={{
                    background: 'linear-gradient(135deg, #e94560, #0f3460)',
                    color: 'white', border: 'none', padding: '14px 32px', borderRadius: 12,
                    fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                  ➕ Nouvelle séance de musculation
                </button>
                <button onClick={() => { setSessionType('cyclisme'); setShowForm(true); }}
                  style={{
                    background: 'linear-gradient(135deg, #0f3460, #16213e)',
                    color: 'white', border: '2px solid #e94560', padding: '14px 32px', borderRadius: 12,
                    fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                  🚴 Nouvelle sortie cycliste
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Session Type Selector */}
              <div className="card">
                <div className="card-header">
                  <span className="emoji">{sessionType === 'musculation' ? '🏋️' : '🚴'}</span>
                  <h3>Type de séance</h3>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => {
                    setSessionType('musculation');
                    if (form.exercises.length === 0) initExercises(form.day);
                  }}
                    style={{
                      flex: 1, padding: '14px 20px', borderRadius: 12, fontSize: '1rem', fontWeight: 600,
                      border: sessionType === 'musculation' ? '2px solid #e94560' : '2px solid #2a2a40',
                      background: sessionType === 'musculation' ? 'rgba(233, 69, 96, 0.2)' : '#12121a',
                      color: sessionType === 'musculation' ? '#ff6b81' : '#a0a0b8',
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                    }}>
                    🏋️ Musculation
                  </button>
                  <button type="button" onClick={() => setSessionType('cyclisme')}
                    style={{
                      flex: 1, padding: '14px 20px', borderRadius: 12, fontSize: '1rem', fontWeight: 600,
                      border: sessionType === 'cyclisme' ? '2px solid #e94560' : '2px solid #2a2a40',
                      background: sessionType === 'cyclisme' ? 'rgba(233, 69, 96, 0.2)' : '#12121a',
                      color: sessionType === 'cyclisme' ? '#ff6b81' : '#a0a0b8',
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                    }}>
                    🚴 Cyclisme
                  </button>
                </div>
              </div>

              {/* Date & Day */}
              <div className="card">
                <div className="card-header">
                  <span className="emoji">📅</span>
                  <h3>Date et type de séance</h3>
                </div>
                <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={labelStyle}>Date</label>
                    <input type="date" value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      style={inputStyle} />
                  </div>
                  {sessionType === 'musculation' && (
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <label style={labelStyle}>Jour d'entraînement</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3].map(d => (
                          <button key={d} type="button"
                            onClick={() => handleDayChange(d)}
                            style={{
                              flex: 1, padding: '10px 8px', borderRadius: 10,
                              border: form.day === d ? '2px solid #e94560' : '2px solid #2a2a40',
                              background: form.day === d ? 'rgba(233, 69, 96, 0.2)' : '#12121a',
                              color: form.day === d ? '#ff6b81' : '#a0a0b8',
                              cursor: 'pointer', fontWeight: form.day === d ? 700 : 400,
                              fontSize: '0.85rem', fontFamily: 'inherit', transition: 'all 0.2s',
                            }}>
                            Jour {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Weight & Mood */}
              <div className="card">
                <div className="card-header">
                  <span className="emoji">⚖️</span>
                  <h3>Poids et état du jour</h3>
                </div>
                <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', marginBottom: 15 }}>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <label style={labelStyle}>Poids (kg) *</label>
                    <input type="number" step="0.1" min="30" max="200"
                      placeholder="ex: 62.5" value={form.weight}
                      onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                      required style={inputStyle} />
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={labelStyle}>Énergie</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['Faible', 'Moyenne', 'Bonne', 'Excellente'].map(e => (
                        <button key={e} type="button"
                          onClick={() => setForm(f => ({ ...f, energy: e }))}
                          style={{
                            flex: 1, padding: '8px 6px', borderRadius: 8,
                            border: form.energy === e ? '2px solid #e94560' : '1px solid #2a2a40',
                            background: form.energy === e ? 'rgba(233, 69, 96, 0.15)' : 'transparent',
                            color: form.energy === e ? '#ff6b81' : '#6b6b80',
                            cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                            fontFamily: 'inherit', transition: 'all 0.2s',
                          }}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Humeur</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['😫', '😟', '😐', '🙂', '😊'].map(m => (
                      <button key={m} type="button"
                        onClick={() => setForm(f => ({ ...f, mood: m }))}
                        style={{
                          width: 48, height: 48, borderRadius: 12,
                          border: form.mood === m ? '2px solid #e94560' : '2px solid #2a2a40',
                          background: form.mood === m ? 'rgba(233, 69, 96, 0.2)' : '#12121a',
                          fontSize: '1.5rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ===== MUSCULATION: Exercises ===== */}
              {sessionType === 'musculation' && (
                <div className="card">
                  <div className="card-header">
                    <span className="emoji">🏋️</span>
                    <h3>{dayLabels[form.day]} — Exercices</h3>
                  </div>
                  {form.exercises.length === 0 ? (
                    <p style={{ color: '#6b6b80' }}>Sélectionne un jour pour charger les exercices</p>
                  ) : (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>✓</th>
                            <th>Exercice</th>
                            <th>Séries</th>
                            <th>Reps</th>
                            <th>Poids (kg)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.exercises.map((ex, i) => (
                            <tr key={i} style={{
                              opacity: ex.completed ? 0.6 : 1,
                              textDecoration: ex.completed ? 'line-through' : 'none',
                            }}>
                              <td>
                                <input type="checkbox"
                                  checked={ex.completed}
                                  onChange={e => updateExercise(i, 'completed', e.target.checked)}
                                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#e94560' }} />
                              </td>
                              <td style={{ fontWeight: 600, fontSize: '0.95rem' }}>{ex.name}</td>
                              <td>
                                <input type="number" min="1" max="10"
                                  value={ex.setsDone}
                                  onChange={e => updateExercise(i, 'setsDone', parseInt(e.target.value) || 1)}
                                  style={{
                                    width: 60, padding: '6px 8px', borderRadius: 8,
                                    border: '1px solid #2a2a40', background: '#0a0a0f',
                                    color: 'white', fontSize: '0.9rem', textAlign: 'center',
                                    fontFamily: 'inherit',
                                  }} />
                              </td>
                              <td>
                                <input type="text" value={ex.repsDone}
                                  onChange={e => updateExercise(i, 'repsDone', e.target.value)}
                                  style={{
                                    width: 80, padding: '6px 8px', borderRadius: 8,
                                    border: '1px solid #2a2a40', background: '#0a0a0f',
                                    color: 'white', fontSize: '0.9rem', textAlign: 'center',
                                    fontFamily: 'inherit',
                                  }} />
                              </td>
                              <td>
                                <input type="number" step="0.5" min="0"
                                  placeholder="—" value={ex.weight}
                                  onChange={e => updateExercise(i, 'weight', e.target.value)}
                                  style={{
                                    width: 70, padding: '6px 8px', borderRadius: 8,
                                    border: '1px solid #2a2a40', background: '#0a0a0f',
                                    color: 'white', fontSize: '0.9rem', textAlign: 'center',
                                    fontFamily: 'inherit',
                                  }} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {form.exercises.length > 0 && (
                    <div style={{
                      marginTop: 12, padding: '8px 12px', borderRadius: 8,
                      background: 'rgba(0, 214, 143, 0.1)', display: 'inline-block',
                    }}>
                      <span style={{ color: '#00d68f', fontWeight: 700, fontSize: '0.85rem' }}>
                        ✅ {completedCount(form.exercises)}/{form.exercises.length} exercices complétés
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ===== CYCLISME: Cycling fields ===== */}
              {sessionType === 'cyclisme' && (
                <div className="card">
                  <div className="card-header">
                    <span className="emoji">🚴</span>
                    <h3>Détails de la sortie cycliste</h3>
                  </div>
                  <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', marginBottom: 15 }}>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <label style={labelStyle}>Durée (minutes) *</label>
                      <input type="number" min="5" max="300"
                        placeholder="ex: 30" value={form.duration}
                        onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                        required style={inputStyle} />
                    </div>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <label style={labelStyle}>Distance (km)</label>
                      <input type="number" step="0.1" min="0"
                        placeholder="ex: 10" value={form.distance}
                        onChange={e => setForm(f => ({ ...f, distance: e.target.value }))}
                        style={inputStyle} />
                    </div>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <label style={labelStyle}>Fréquence cardiaque (bpm)</label>
                      <input type="number" min="40" max="220"
                        placeholder="ex: 130" value={form.bpm}
                        onChange={e => setForm(f => ({ ...f, bpm: e.target.value }))}
                        style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <label style={labelStyle}>Intensité</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {intensityOptions.map(opt => (
                          <button key={opt} type="button"
                            onClick={() => setForm(f => ({ ...f, intensity: opt }))}
                            style={{
                              flex: 1, padding: '10px 8px', borderRadius: 10,
                              border: form.intensity === opt ? '2px solid #e94560' : '2px solid #2a2a40',
                              background: form.intensity === opt ? 'rgba(233, 69, 96, 0.2)' : '#12121a',
                              color: form.intensity === opt ? '#ff6b81' : '#a0a0b8',
                              cursor: 'pointer', fontWeight: form.intensity === opt ? 700 : 400,
                              fontSize: '0.85rem', fontFamily: 'inherit', transition: 'all 0.2s',
                            }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 250 }}>
                      <label style={labelStyle}>Météo</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {weatherOptions.map(w => (
                          <button key={w.value} type="button"
                            onClick={() => setForm(f => ({ ...f, meteo: w.value }))}
                            style={{
                              flex: 1, padding: '10px 6px', borderRadius: 10,
                              border: form.meteo === w.value ? '2px solid #e94560' : '2px solid #2a2a40',
                              background: form.meteo === w.value ? 'rgba(233, 69, 96, 0.2)' : '#12121a',
                              color: form.meteo === w.value ? '#ff6b81' : '#a0a0b8',
                              cursor: 'pointer', fontWeight: form.meteo === w.value ? 700 : 400,
                              fontSize: '0.8rem', fontFamily: 'inherit', transition: 'all 0.2s',
                              textAlign: 'center',
                            }}>
                            {w.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="card">
                <div className="card-header">
                  <span className="emoji">📝</span>
                  <h3>Notes</h3>
                </div>
                <textarea rows={3} placeholder="Comment s'est passée la séance ? Difficulté, ressenti, ajustements..."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: '1px solid #2a2a40', background: '#12121a',
                    color: 'white', fontSize: '0.95rem', fontFamily: 'inherit',
                    resize: 'vertical', lineHeight: 1.5,
                  }} />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                  style={{
                    padding: '12px 24px', borderRadius: 10,
                    border: '2px solid #2a2a40', background: 'transparent',
                    color: '#a0a0b8', fontSize: '0.95rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                  Annuler
                </button>
                <button type="submit"
                  style={{
                    padding: '12px 32px', borderRadius: 10,
                    border: 'none', background: 'linear-gradient(135deg, #e94560, #0f3460)',
                    color: 'white', fontSize: '1rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 0 20px rgba(233, 69, 96, 0.3)',
                  }}>
                  {sessionType === 'cyclisme' ? '🚴 Enregistrer la sortie' : '💾 Enregistrer la séance'}
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {/* ====== HISTORY ====== */}
      {activeTab === 'history' && (
        <div>
          {entries.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6b6b80' }}>
              <p style={{ fontSize: '1.1rem' }}>Aucune séance enregistrée pour l'instant.</p>
              <p style={{ marginTop: 8 }}>Commence par logger ta première séance !</p>
            </div>
          ) : (
            entries.map(entry => {
              const isCycling = entry.type === 'cyclisme';
              return (
                <div key={entry.id} className="card" style={{ position: 'relative' }}>
                  <button onClick={() => deleteEntry(entry.id)}
                    style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'rgba(255, 61, 113, 0.15)', border: 'none',
                      color: '#ff3d71', width: 32, height: 32, borderRadius: 8,
                      cursor: 'pointer', fontSize: '1rem', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }} title="Supprimer">🗑️</button>

                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{
                      background: isCycling ? 'rgba(15, 52, 96, 0.5)' : 'rgba(233, 69, 96, 0.2)',
                      color: isCycling ? '#5dade2' : '#ff6b81',
                      padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                    }}>
                      {isCycling ? '🚴 Cyclisme' : dayLabels[entry.day] || 'Séance'}
                    </span>
                    <span style={{ color: '#a0a0b8', fontSize: '0.9rem' }}>📅 {entry.date}</span>
                    <span style={{ fontSize: '1.3rem' }}>{entry.mood}</span>
                    <span className="tag tag-yellow">{entry.energy}</span>
                    <span style={{ color: '#ff6b81', fontWeight: 700 }}>⚖️ {entry.weight} kg</span>
                  </div>

                  {/* Cycling details */}
                  {isCycling && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                      <span className="tag tag-blue">⏱️ {entry.duration} min</span>
                      {entry.distance && <span className="tag tag-green">📏 {entry.distance} km</span>}
                      <span className="tag tag-yellow">⚡ {entry.intensity}</span>
                      {entry.meteo && <span className="tag tag-purple">{entry.meteo === 'Ensoleillé' ? '☀️' : entry.meteo === 'Nuageux' ? '☁️' : entry.meteo === 'Pluie' ? '🌧️' : '💨'} {entry.meteo}</span>}
                      {entry.bpm && <span className="tag tag-red">❤️ {entry.bpm} bpm</span>}
                    </div>
                  )}

                  {/* Exercise table (musculation only) */}
                  {!isCycling && entry.exercises && entry.exercises.length > 0 && (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Exercice</th>
                            <th>Séries</th>
                            <th>Reps</th>
                            <th>Poids</th>
                            <th>✓</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entry.exercises.map((ex, i) => (
                            <tr key={i} style={{ opacity: ex.completed ? 0.6 : 1 }}>
                              <td style={{ fontWeight: 600 }}>{ex.name}</td>
                              <td>{ex.setsDone}</td>
                              <td>{ex.repsDone}</td>
                              <td style={{ color: '#ff6b81', fontWeight: 600 }}>{ex.weight || '—'} kg</td>
                              <td>{ex.completed ? '✅' : '⬜'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {entry.notes && (
                    <div style={{
                      marginTop: 12, padding: '10px 14px', borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.03)', color: '#a0a0b8',
                      fontSize: '0.9rem', fontStyle: 'italic',
                    }}>
                      📝 {entry.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ====== STATS ====== */}
      {activeTab === 'stats' && (
        <div>
          {entries.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6b6b80' }}>
              <p>Pas encore de données. Commence par logger des séances !</p>
            </div>
          ) : (
            <>
              {/* Summary cards */}
              <div className="recovery-grid">
                <div className="card">
                  <div className="card-header">
                    <span className="emoji">📊</span>
                    <h3>Résumé</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#a0a0b8' }}>Total séances</span>
                      <span style={{ fontWeight: 700, color: '#ff6b81' }}>{muscEntries.length} 🏋️ / {cycEntries.length} 🚴</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#a0a0b8' }}>Poids actuel</span>
                      <span style={{ fontWeight: 700, color: '#ff6b81' }}>{weightEnd} kg</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#a0a0b8' }}>Première séance</span>
                      <span style={{ fontWeight: 700 }}>{weightStart} kg</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#a0a0b8' }}>Évolution</span>
                      <span style={{
                        fontWeight: 700,
                        color: weightDiff >= 0 ? '#00d68f' : '#ff3d71',
                      }}>
                        {weightDiff >= 0 ? '+' : ''}{weightDiff.toFixed(1)} kg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="emoji">😊</span>
                    <h3>Humeur moyenne</h3>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{ fontSize: '3rem' }}>
                      {avgMood >= 4.5 ? '😊' : avgMood >= 3.5 ? '🙂' : avgMood >= 2.5 ? '😐' : avgMood >= 1.5 ? '😟' : '😫'}
                    </div>
                    <div style={{ color: '#a0a0b8', marginTop: 8 }}>
                      {avgMood.toFixed(1)}/5 en moyenne
                    </div>
                  </div>
                </div>
              </div>

              {/* Cycling summary card */}
              {cycEntries.length > 0 && (
                <div className="card" style={{
                  border: '1px solid rgba(15, 52, 96, 0.5)',
                  background: 'linear-gradient(145deg, #16213e 0%, #0f3460 100%)',
                }}>
                  <div className="card-header">
                    <span className="emoji">🚴</span>
                    <h3>Résumé cyclisme</h3>
                  </div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{
                      flex: 1, minWidth: 120, padding: 16, borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.05)', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#5dade2' }}>{cycEntries.length}</div>
                      <div style={{ color: '#a0a0b8', fontSize: '0.85rem', marginTop: 4 }}>Sorties</div>
                    </div>
                    <div style={{
                      flex: 1, minWidth: 120, padding: 16, borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.05)', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#5dade2' }}>{cycTotalKm.toFixed(1)}</div>
                      <div style={{ color: '#a0a0b8', fontSize: '0.85rem', marginTop: 4 }}>Kilomètres</div>
                    </div>
                    <div style={{
                      flex: 1, minWidth: 120, padding: 16, borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.05)', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#5dade2' }}>{cycTotalMin}</div>
                      <div style={{ color: '#a0a0b8', fontSize: '0.85rem', marginTop: 4 }}>Minutes totales</div>
                    </div>
                    <div style={{
                      flex: 1, minWidth: 120, padding: 16, borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.05)', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#5dade2' }}>{cycAvgDuration}</div>
                      <div style={{ color: '#a0a0b8', fontSize: '0.85rem', marginTop: 4 }}>Min moy / sortie</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weight chart (simple bar) */}
              {muscEntries.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <span className="emoji">📈</span>
                    <h3>Évolution du poids</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 200, padding: '10px 0' }}>
                    {[...muscEntries].reverse().map((entry, i) => {
                      const w = parseFloat(entry.weight);
                      const minW = Math.min(...muscEntries.map(e => parseFloat(e.weight))) - 1;
                      const maxW = Math.max(...muscEntries.map(e => parseFloat(e.weight))) + 1;
                      const range = maxW - minW || 1;
                      const heightPct = ((w - minW) / range) * 100;
                      return (
                        <div key={i} style={{
                          flex: 1, display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: 4, minWidth: 30,
                        }}>
                          <span style={{ fontSize: '0.7rem', color: '#ff6b81', fontWeight: 700 }}>
                            {w}
                          </span>
                          <div style={{
                            width: '100%', maxWidth: 40, height: `${Math.max(heightPct, 10)}%`,
                            background: 'linear-gradient(to top, #e94560, #ff6b81)',
                            borderRadius: '6px 6px 0 0', transition: 'height 0.5s',
                          }} />
                          <span style={{ fontSize: '0.6rem', color: '#6b6b80', textAlign: 'center' }}>
                            {entry.date.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Per-day breakdown (musculation) */}
              {muscEntries.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <span className="emoji">🏋️</span>
                    <h3>Séances musculation par jour</h3>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {[1, 2, 3].map(d => {
                      const count = muscEntries.filter(e => e.day === d).length;
                      return (
                        <div key={d} style={{
                          flex: 1, minWidth: 140, padding: 16, borderRadius: 12,
                          background: 'rgba(255, 255, 255, 0.03)', textAlign: 'center',
                        }}>
                          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ff6b81' }}>{count}</div>
                          <div style={{ color: '#a0a0b8', fontSize: '0.85rem', marginTop: 4 }}>
                            {dayLabels[d]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Weighing info */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="emoji">⚖️</span>
          <h3>Rappel pesée</h3>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span className="tag tag-blue">Fréquence : {data.weighing.frequency}</span>
          <span className="tag tag-green">Moment : {data.weighing.moment}</span>
          <span className="tag tag-red">Objectif : {data.weighing.objective}</span>
        </div>
      </div>
    </>
  );
}
