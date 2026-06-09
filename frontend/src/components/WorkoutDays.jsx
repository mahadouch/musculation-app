import { useState } from 'react';

function extractYouTubeId(url) {
  if (!url) return null;
  // Match youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, etc.
  const patterns = [
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function WorkoutDays({ days }) {
  const [activeDay, setActiveDay] = useState(0);
  const [openVideos, setOpenVideos] = useState({});

  const toggleVideo = (key) => {
    setOpenVideos(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
        {days[activeDay]?.exercises.map((ex, i) => {
          const videoKey = `${activeDay}-${i}`;
          const isVideoOpen = openVideos[videoKey];
          const videoId = ex.video ? extractYouTubeId(ex.video.url) : null;

          return (
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
                  <h4 style={{ fontSize: '0.9rem', color: '#5c5c5c', marginBottom: 8, marginTop: 15 }}>
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
                  <h4 style={{ fontSize: '0.9rem', color: '#5c5c5c', marginBottom: 8 }}>
                    ⚠️ Erreurs courantes :
                  </h4>
                  {ex.errors.map((err, j) => (
                    <div className="error-item" key={j}>{err}</div>
                  ))}
                </div>
              )}

              {ex.video && videoId && (
                <div className="exercise-video-section">
                  <button
                    className={`video-toggle-btn ${isVideoOpen ? 'active' : ''}`}
                    onClick={() => toggleVideo(videoKey)}
                  >
                    <span className="video-toggle-icon">
                      {isVideoOpen ? '⏸️' : '▶️'}
                    </span>
                    <span className="video-toggle-text">
                      {isVideoOpen ? 'Masquer la vidéo' : `🎬 Voir la vidéo — ${ex.video.title}`}
                    </span>
                  </button>

                  <div className={`video-player-wrapper ${isVideoOpen ? 'open' : ''}`}>
                    <iframe
                      className="video-iframe"
                      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                      title={ex.video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* Fallback: lien simple si pas de ID YouTube valide */}
              {ex.video && !videoId && (
                <div style={{ marginTop: 12 }}>
                  <a
                    href={ex.video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#d97757',
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
          );
        })}
      </div>
    </>
  );
}
