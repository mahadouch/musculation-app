import { useState } from 'react';

export default function Videos({ data }) {
  const [activeDay, setActiveDay] = useState('day1');

  const dayLabels = {
    day1: 'JOUR 1 — Haut du corps',
    day2: 'JOUR 2 — Bas du corps',
    day3: 'JOUR 3 — Full body',
  };

  return (
    <>
      <h2 className="section-title">
        <span className="icon">🎬</span> VIDÉOS DE RÉFÉRENCE
      </h2>

      <div className="day-tabs">
        {Object.keys(dayLabels).map(key => (
          <button
            key={key}
            className={`day-tab ${activeDay === key ? 'active' : ''}`}
            onClick={() => setActiveDay(key)}
          >
            {dayLabels[key]}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {data[activeDay]?.map((video, i) => (
          <div className="video-card" key={i}>
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              🎥 {video.title}
            </a>
            <p className="video-channel">📺 {video.channel}</p>
            <p style={{ marginTop: 8, color: '#a0a0b8', fontSize: '0.9rem' }}>
              {video.exercise}
            </p>
          </div>
        ))}
      </div>

      {data.warmup && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 10 }}>🌡️ Échauffement</h3>
          <a
            href={data.warmup}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ff6b81', textDecoration: 'none', fontWeight: 600 }}
          >
            🎥 Warm Up Before Working Out — ATHLEAN-X™
          </a>
        </div>
      )}

      {data.stretching && (
        <div className="card" style={{ marginTop: 10 }}>
          <h3 style={{ marginBottom: 10 }}>🧘 Étirements</h3>
          <a
            href={data.stretching}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ff6b81', textDecoration: 'none', fontWeight: 600 }}
          >
            🎥 Post Workout Stretch Routine — THENX
          </a>
        </div>
      )}
    </>
  );
}
