import { useState } from 'react';

function extractYouTubeId(url) {
  if (!url) return null;
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

export default function Videos({ data }) {
  const [activeDay, setActiveDay] = useState('day1');
  const [openVideos, setOpenVideos] = useState({});

  const dayLabels = {
    day1: 'JOUR 1 — Haut du corps',
    day2: 'JOUR 2 — Bas du corps',
    day3: 'JOUR 3 — Full body',
  };

  const toggleVideo = (key) => {
    setOpenVideos(prev => ({ ...prev, [key]: !prev[key] }));
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

      <div className="exercises-list">
        {data[activeDay]?.map((video, i) => {
          const videoKey = `${activeDay}-${i}`;
          const isOpen = openVideos[videoKey];
          const videoId = extractYouTubeId(video.url);

          return (
            <div className="exercise-card" key={i}>
              <div className="exercise-header">
                <div className="exercise-name">
                  <span className="exercise-number">{i + 1}</span>
                  <span>{video.title}</span>
                </div>
                <div className="exercise-meta">
                  <span className="tag tag-blue">📺 {video.channel}</span>
                  {video.exercise && (
                    <span className="tag tag-purple">💪 {video.exercise}</span>
                  )}
                </div>
              </div>

              {videoId ? (
                <div className="exercise-video-section">
                  <button
                    className={`video-toggle-btn ${isOpen ? 'active' : ''}`}
                    onClick={() => toggleVideo(videoKey)}
                  >
                    <span className="video-toggle-icon">
                      {isOpen ? '⏸️' : '▶️'}
                    </span>
                    <span className="video-toggle-text">
                      {isOpen ? 'Masquer la vidéo' : `🎬 Voir la vidéo — ${video.title}`}
                    </span>
                  </button>

                  <div className={`video-player-wrapper ${isOpen ? 'open' : ''}`}>
                    <iframe
                      className="video-iframe"
                      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#d97757',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    🎬 {video.title}
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {data.warmup && (
        <div className="exercise-card" style={{ marginTop: 16 }}>
          <div className="exercise-header">
            <div className="exercise-name">
              <span className="exercise-number">🌡️</span>
              <span>Échauffement</span>
            </div>
          </div>
          {(() => {
            const warmupId = extractYouTubeId(data.warmup);
            if (warmupId) {
              return (
                <div className="exercise-video-section">
                  <button
                    className={`video-toggle-btn ${openVideos['warmup'] ? 'active' : ''}`}
                    onClick={() => toggleVideo('warmup')}
                  >
                    <span className="video-toggle-icon">
                      {openVideos['warmup'] ? '⏸️' : '▶️'}
                    </span>
                    <span className="video-toggle-text">
                      {openVideos['warmup'] ? 'Masquer la vidéo' : '🎬 Warm Up Before Working Out — ATHLEAN-X™'}
                    </span>
                  </button>
                  <div className={`video-player-wrapper ${openVideos['warmup'] ? 'open' : ''}`}>
                    <iframe
                      className="video-iframe"
                      src={`https://www.youtube.com/embed/${warmupId}?rel=0`}
                      title="Warm Up Before Working Out"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            }
            return (
              <a
                href={data.warmup}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#d97757', textDecoration: 'none', fontWeight: 600 }}
              >
                🎥 Warm Up Before Working Out — ATHLEAN-X™
              </a>
            );
          })()}
        </div>
      )}

      {data.stretching && (
        <div className="exercise-card" style={{ marginTop: 10 }}>
          <div className="exercise-header">
            <div className="exercise-name">
              <span className="exercise-number">🧘</span>
              <span>Étirements</span>
            </div>
          </div>
          {(() => {
            const stretchId = extractYouTubeId(data.stretching);
            if (stretchId) {
              return (
                <div className="exercise-video-section">
                  <button
                    className={`video-toggle-btn ${openVideos['stretching'] ? 'active' : ''}`}
                    onClick={() => toggleVideo('stretching')}
                  >
                    <span className="video-toggle-icon">
                      {openVideos['stretching'] ? '⏸️' : '▶️'}
                    </span>
                    <span className="video-toggle-text">
                      {openVideos['stretching'] ? 'Masquer la vidéo' : '🎬 Post Workout Stretch Routine — THENX'}
                    </span>
                  </button>
                  <div className={`video-player-wrapper ${openVideos['stretching'] ? 'open' : ''}`}>
                    <iframe
                      className="video-iframe"
                      src={`https://www.youtube.com/embed/${stretchId}?rel=0`}
                      title="Post Workout Stretch Routine"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            }
            return (
              <a
                href={data.stretching}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#d97757', textDecoration: 'none', fontWeight: 600 }}
              >
                🎥 Post Workout Stretch Routine — THENX
              </a>
            );
          })()}
        </div>
      )}
    </>
  );
}
