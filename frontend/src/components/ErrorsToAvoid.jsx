export default function ErrorsToAvoid({ data }) {
  return (
    <>
      <h2 className="section-title">
        <span className="icon">⚠️</span> ERREURS À ÉVITER
      </h2>
      <div className="card" style={{ borderLeft: '4px solid #ff3d71' }}>
        {data.map((error, i) => (
          <div
            key={i}
            style={{
              padding: '12px 0',
              borderBottom: i < data.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <span style={{
              background: 'rgba(255, 61, 113, 0.2)',
              color: '#ff3d71',
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 800,
              flexShrink: 0,
            }}>
              {i + 1}
            </span>
            <span style={{ color: '#a0a0b8' }}>{error}</span>
          </div>
        ))}
      </div>
    </>
  );
}
