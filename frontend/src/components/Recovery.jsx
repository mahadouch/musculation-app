export default function Recovery({ data }) {
  return (
    <>
      <h2 className="section-title">
        <span className="icon">💆</span> CONSEILS DE RÉCUPÉRATION
      </h2>

      {/* Sommeil */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="emoji">🛌</span>
          <h3>Sommeil</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Paramètre</th>
                <th>Recommandation</th>
                <th>Pourquoi</th>
              </tr>
            </thead>
            <tbody>
              {data.sleep.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.param}</td>
                  <td><span className="tag tag-green">{item.value}</span></td>
                  <td style={{ color: '#a0a0b8', fontSize: '0.85rem' }}>{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hydratation */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="emoji">💧</span>
          <h3>Hydratation</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Moment</th>
                <th>Quantité</th>
                <th>Conseil</th>
              </tr>
            </thead>
            <tbody>
              {data.hydration.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.moment}</td>
                  <td><span className="tag tag-blue">{item.quantity}</span></td>
                  <td style={{ color: '#a0a0b8', fontSize: '0.85rem' }}>{item.advice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Étirements */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="emoji">🧘</span>
          <h3>Étirements</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Exercice</th>
                <th>Durée</th>
                <th>Muscles</th>
              </tr>
            </thead>
            <tbody>
              {data.stretches.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.exercise}</td>
                  <td><span className="tag tag-yellow">{item.duration}</span></td>
                  <td style={{ color: '#a0a0b8' }}>{item.muscles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signes de surcharge */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="emoji">⚠️</span>
          <h3>Signes de surcharge</h3>
        </div>
        <p style={{ color: '#a0a0b8', marginBottom: 12, fontSize: '0.9rem' }}>
          Si tu ressens ces signes, prends 1-2 jours de repos supplémentaires :
        </p>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Signe</th>
              </tr>
            </thead>
            <tbody>
              {data.overtrainingSigns.map((sign, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--danger)' }}>❌ {sign}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 15, color: '#ffaa00', fontSize: '0.9rem', fontWeight: 600 }}>
          💡 Mieux vaut 1 jour de trop de repos qu'une blessure qui te met 3 semaines de côté !
        </p>
      </div>
    </>
  );
}
