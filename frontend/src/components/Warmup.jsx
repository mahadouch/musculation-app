import { useState } from 'react';

export default function Warmup({ data }) {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <>
      <h2 className="section-title">
        <span className="icon">🔥</span> SÉANCES D'ÉCHAUFFEMENT
      </h2>

      <div className="day-tabs" style={{ marginBottom: 20 }}>
        <button
          className={`day-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          🌡️ Général
        </button>
        <button
          className={`day-tab ${activeTab === 'day1' ? 'active' : ''}`}
          onClick={() => setActiveTab('day1')}
        >
          💪 Jour 1
        </button>
        <button
          className={`day-tab ${activeTab === 'day2' ? 'active' : ''}`}
          onClick={() => setActiveTab('day2')}
        >
          🦵 Jour 2
        </button>
        <button
          className={`day-tab ${activeTab === 'day3' ? 'active' : ''}`}
          onClick={() => setActiveTab('day3')}
        >
          🔥 Jour 3
        </button>
        <button
          className={`day-tab ${activeTab === 'cycling' ? 'active' : ''}`}
          onClick={() => setActiveTab('cycling')}
        >
          🚴 Cyclisme
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="card">
          <h3 style={{ marginBottom: 15 }}>🌡️ Échauffement général (5-10 min)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Exercice</th>
                  <th>Durée</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {data.general.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{item.exercise}</td>
                    <td><span className="tag tag-blue">{item.duration}</span></td>
                    <td style={{ color: '#5c5c5c' }}>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'day1' || activeTab === 'day2' || activeTab === 'day3') && (
        <div className="card">
          <h3 style={{ marginBottom: 15 }}>
            🏋️ Échauffement spécifique — {activeTab === 'day1' ? 'Haut du corps' : activeTab === 'day2' ? 'Bas du corps' : 'Full body'}
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Exercice</th>
                  <th>Séries</th>
                  <th>Reps</th>
                  <th>Objectif</th>
                </tr>
              </thead>
              <tbody>
                {data.specific[activeTab].map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{item.exercise}</td>
                    <td><span className="tag tag-red">{item.series}</span></td>
                    <td><span className="tag tag-green">{item.reps}</span></td>
                    <td style={{ color: '#5c5c5c' }}>{item.objective}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'cycling' && (
        <div className="card cycling-card">
          <h4>🚴 Échauffement pour le cyclisme (5 min)</h4>
          <div className="table-container" style={{ marginTop: 15 }}>
            <table>
              <thead>
                <tr>
                  <th>Minute</th>
                  <th>Intensité</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {data.cycling.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{item.minute}</td>
                    <td><span className="tag tag-yellow">{item.intensity}</span></td>
                    <td style={{ color: '#5c5c5c' }}>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 15, color: '#d4943a', fontSize: '0.9rem' }}>
            ⚠️ Règle d'or : L'échauffement ne doit PAS te fatiguer. Tu dois ressentir une légère chaleur, pas l'épuisement.
          </p>
        </div>
      )}
    </>
  );
}
