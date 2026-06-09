export default function Supplements({ data }) {
  const colors = ['#d97757', '#d4943a', '#4a9d6e', '#4a7ab5'];

  return (
    <>
      <h2 className="section-title">
        <span className="icon">💊</span> SUPPLÉMENTS RECOMMANDÉS (optionnels)
      </h2>
      <div className="card-grid">
        {data.map((item, i) => (
          <div className="card" key={i} style={{ borderTop: `3px solid ${colors[i]}` }}>
            <div className="card-header">
              <span className="emoji" style={{ fontSize: '1.5rem' }}>💊</span>
              <h3>{item.name}</h3>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span className="tag tag-blue">Dosage : {item.dosage}</span>
            </div>
            <p style={{ color: '#5c5c5c', fontSize: '0.9rem' }}>{item.utility}</p>
          </div>
        ))}
      </div>
    </>
  );
}
