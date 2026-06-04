export default function Profile({ data }) {
  const items = [
    { label: 'Âge', value: data.age, emoji: '🎂' },
    { label: 'Taille', value: data.taille, emoji: '📏' },
    { label: 'Poids actuel', value: data.poids, emoji: '⚖️' },
    { label: 'IMC', value: data.imc, emoji: '📊' },
    { label: 'Objectif', value: data.objectif, emoji: '🎯' },
    { label: 'Équipement', value: data.equipement, emoji: '🏋️' },
    { label: 'Niveau', value: data.niveau, emoji: '📈' },
  ];

  return (
    <>
      <h2 className="section-title">
        <span className="icon">👤</span> PROFIL UTILISATEUR
      </h2>
      <div className="card-grid">
        {items.map((item, i) => (
          <div className="card" key={i}>
            <div className="card-header">
              <span className="emoji">{item.emoji}</span>
              <h3>{item.label}</h3>
            </div>
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ff6b81' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
