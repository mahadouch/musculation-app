import { useState, useEffect } from 'react';
import { fetchTrackingEntries } from '../api';

const cyclingTips = [
  'Le cyclisme léger (30 min) est idéal les jours de repos pour favoriser la récupération sans brûler trop de calories.',
  'Vise une intensité Légère ou Modérée pour le cyclisme complémentaire — l\'objectif n\'est pas de brûler des calories, mais de stimuler la circulation sanguine.',
  'Évite les sorties longues et intenses (>1h intense) : tu risques de compromettre ta récupération musculaire.',
  'Hydrate-toi bien avant, pendant et après chaque sortie cycliste.',
  'S\'il pleut ou fait très vent, préfère un entraînement en intérieur ou reporte la sortie — ne te risque pas.',
  'Le vélo d\'extérieur est excellent pour le moral et la vitamine D, mais garde-le en complément du programme de musculation.',
  'Surveille ton appétit : le cyclisme peut augmenter ta faim, ce qui est parfait pour la prise de poids — mange plus !',
  'Utilise une intensité Modérée pour brûler un minimum de graisse tout en conservant l\'énergie pour la musculation.',
];

const intensityOptions = ['Légère', 'Modérée', 'Intense'];
const weatherOptions = [
  { label: '☀️ Ensoleillé', value: 'Ensoleillé' },
  { label: '☁️ Nuageux', value: 'Nuageux' },
  { label: '🌧️ Pluie', value: 'Pluie' },
  { label: '💨 Vent', value: 'Vent' },
];

export default function Cycling({ data }) {
  const [entries, setEntries] = useState([]);

  const loadEntries = async () => {
    try {
      const data = await fetchTrackingEntries();
      setEntries(data);
    } catch (err) {
      console.error('Erreur chargement entrées cyclisme:', err);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const cyclingEntries = entries.filter(e => e.type === 'cyclisme');
  const totalSorties = cyclingEntries.length;
  const totalKm = cyclingEntries.reduce((sum, e) => sum + (parseFloat(e.distance) || 0), 0);
  const totalMinutes = cyclingEntries.reduce((sum, e) => sum + (parseInt(e.duration) || 0), 0);
  const avgDuration = totalSorties > 0 ? Math.round(totalMinutes / totalSorties) : 0;

  const scheduleEntries = Array.isArray(data) ? data : [];
  const cyclingDays = scheduleEntries.filter(s =>
    s.activity && (s.activity.toLowerCase().includes('cyclisme') || s.activity.toLowerCase().includes('vélo'))
  );

  return (
    <>
      <h2 className="section-title">
        <span className="icon">🚴</span> CYCLISME
      </h2>

      {/* Cycling Schedule from Program */}
      <div className="card">
        <div className="card-header">
          <span className="emoji">📅</span>
          <h3>Planning cyclisme dans le programme</h3>
        </div>
        {cyclingDays.length === 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Jour</th>
                  <th>Activité</th>
                  <th>Durée</th>
                </tr>
              </thead>
              <tbody>
                {scheduleEntries.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{item.day}</td>
                    <td>{item.activity}</td>
                    <td><span className="tag tag-blue">{item.duration}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Jour</th>
                  <th>Activité</th>
                  <th>Durée</th>
                </tr>
              </thead>
              <tbody>
                {cyclingDays.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{item.day}</td>
                    <td>{item.activity}</td>
                    <td><span className="tag tag-blue">{item.duration}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cycling Stats from Journal */}
      <div className="recovery-grid">
        <div className="card">
          <div className="card-header">
            <span className="emoji">📊</span>
            <h3>Résumé de tes sorties</h3>
          </div>
          {totalSorties === 0 ? (
            <p style={{ color: '#999999', fontSize: '0.95rem' }}>
              Aucune sortie cycliste enregistrée. Va dans "Suivi" pour logger tes sorties !
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5c5c5c' }}>Total sorties</span>
                <span style={{ fontWeight: 700, color: '#d97757' }}>{totalSorties}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5c5c5c' }}>Total km</span>
                <span style={{ fontWeight: 700, color: '#d97757' }}>{totalKm.toFixed(1)} km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5c5c5c' }}>Total minutes</span>
                <span style={{ fontWeight: 700, color: '#d97757' }}>{totalMinutes} min</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5c5c5c' }}>Durée moyenne</span>
                <span style={{ fontWeight: 700, color: '#d97757' }}>{avgDuration} min</span>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="emoji">🌡️</span>
            <h3>Météo préférée</h3>
          </div>
          {cyclingEntries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {weatherOptions.map(w => {
                const count = cyclingEntries.filter(e => e.meteo === w.value).length;
                return (
                  <div key={w.value} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#5c5c5c' }}>{w.label}</span>
                    <span style={{ fontWeight: 700, color: '#d97757' }}>{count} sortie{count > 1 ? 's' : ''}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#999999', fontSize: '0.95rem' }}>
              Aucune donnée de météo.
            </p>
          )}
        </div>
      </div>

      {/* Recent cycling entries */}
      {cyclingEntries.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="emoji">🚴</span>
            <h3>Dernières sorties cyclistes</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Durée</th>
                  <th>Distance</th>
                  <th>Intensité</th>
                  <th>Météo</th>
                  <th>Poids</th>
                </tr>
              </thead>
              <tbody>
                {cyclingEntries.slice(0, 10).map((entry, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{entry.date}</td>
                    <td><span className="tag tag-blue">{entry.duration} min</span></td>
                    <td>{entry.distance ? `${entry.distance} km` : '—'}</td>
                    <td><span className="tag tag-yellow">{entry.intensity}</span></td>
                    <td>{entry.meteo || '—'}</td>
                    <td style={{ color: '#d97757', fontWeight: 600 }}>{entry.weight} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card">
        <div className="card-header">
          <span className="emoji">💡</span>
          <h3>Conseils cyclisme pour la prise de poids</h3>
        </div>
        {cyclingTips.map((tip, i) => (
          <div key={i} style={{
            padding: '8px 0',
            borderBottom: i < cyclingTips.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <span style={{
              background: 'rgba(217, 119, 87, 0.1)', color: '#d97757',
              width: 24, height: 24, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
            }}>{i + 1}</span>
            <span style={{ color: '#5c5c5c', fontSize: '0.9rem' }}>{tip}</span>
          </div>
        ))}
      </div>
    </>
  );
}
