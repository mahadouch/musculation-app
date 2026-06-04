import { useState } from 'react';

export default function WorkoutDays({ days }) {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <>
      <h2 className="section-title">
        <span className="icon">🏋️</span> PROGRAMME D'ENTRAÎNEMENT
      </h2>

      <div className="day-tabs">
        {days.map((day, i) => (
          <button
            key={i}
            className={`day-tab ${activeDay === i ? 'active' : ''}`}
            onClick={() => setActiveDay(i)}
          >
            JOUR {day.number} — {day.title}
          </button>
        ))}
      </div>

      <div className="exercises-list">
        {days[activeDay]?.exercises.map((ex, i) => (
          <div className="exercise-card" key={i}>
            <div className="exercise-header">
              <div className="exercise-name">
                <span className="exercise-number">{ex.number}</span>
                <span>{ex.name}</span>
              </div>
              <div className="exercise-meta">
                {ex.reps && (
                  <div className="meta-badge">
                    <span className="label">Reps</span>
                    <span className="value">{ex.reps}</span>
                  </div>
                )}
                {ex.sets && (
                  <div className="meta-badge">
                    <span className="label">Séries</span>
                    <span className="value">{ex.sets}</span>
                  </div>
                )}
                {ex.rest && (
                  <div className="meta-badge">
                    <span className="label">Repos</span>
                    <span className="value">{ex.rest}</span>
                  </div>
                )}
              </div>
            </div>

            {ex.muscles && (
              <div style={{ marginBottom: 10 }}>
                <span className="tag tag-purple">💪 {ex.muscles}</span>
                {ex.equipment && (
                  <span className="tag tag-blue">🔧 {ex.equipment}</span>
                )}
              </div>
            )}

            {ex.execution.length > 0 && (
              <>
                <h4 style={{ fontSize: '0.9rem', color: '#a0a0b8', marginBottom: 8, marginTop: 15 }}>
                  📋 Exécution :
                </h4>
                <ol className="steps">
                  {ex.execution.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </>
            )}

            {ex.errors.length > 0 && (
              <div className="errors-list">
                <h4 style={{ fontSize: '0.9rem', color: '#a0a0b8', marginBottom: 8 }}>
                  ⚠️ Erreurs courantes :
                </h4>
                {ex.errors.map((err, j) => (
                  <div className="error-item" key={j}>{err}</div>
                ))}
              </div>
            )}

            {ex.video && (
              <div style={{ marginTop: 12 }}>
                <a
                  href={ex.video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#ff6b81',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  🎬 {ex.video.title}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
