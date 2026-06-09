export default function GoldenRules({ data }) {
  const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
  const colors = ['#d97757', '#d4943a', '#4a9d6e', '#4a7ab5', '#7c6abf'];

  return (
    <>
      <h2 className="section-title">
        <span className="icon">⭐</span> LES 5 RÈGLES D'OR DE LA MUSCULATION
      </h2>
      <div className="card-grid">
        {data.map((item, i) => (
          <div className="card" key={i} style={{ borderLeft: `4px solid ${colors[i]}` }}>
            <div className="card-header">
              <span className="emoji" style={{ fontSize: '1.8rem' }}>{emojis[i]}</span>
              <h3 style={{ color: colors[i] }}>{item.rule}</h3>
            </div>
            <p style={{ color: '#5c5c5c', fontSize: '0.95rem' }}>{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
