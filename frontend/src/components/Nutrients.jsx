export default function Nutrients({ data }) {
  // Tableau des nutriments avec kcal
  const nutrients = [
    { name: 'Protéines', kcalPerGram: 4, color: '#4a9d6e', emoji: '🥩', examples: 'Poulet, œufs, poisson, whey, tofu' },
    { name: 'Glucides', kcalPerGram: 4, color: '#d4943a', emoji: '🍚', examples: 'Riz, pâtes, pain, fruits, patate douce' },
    { name: 'Lipides', kcalPerGram: 9, color: '#4a7ab5', emoji: '🥑', examples: 'Huile d\'olive, noix, avocat, beurre de cacahuète' },
    { name: 'Alcool', kcalPerGram: 7, color: '#c45c5c', emoji: '🍺', examples: 'Bière, vin, cocktails (à limiter)' },
  ];

  // Calcul des macros basé sur les besoins
  const dailyNeeds = data.nutrition?.dailyNeeds || {};
  const proteinG = parseInt(dailyNeeds.proteines) || parseInt(data.profile.poids) * 2;
  const carbsMinG = parseInt(dailyNeeds.glucides) || parseInt(data.profile.poids) * 4;
  const carbsMaxG = carbsMinG + parseInt(data.profile.poids);
  const lipidesG = parseInt(dailyNeeds.lipides) || parseInt(data.profile.poids);

  const macroBreakdown = [
    { name: 'Protéines', grams: proteinG, kcalPerGram: 4, color: '#4a9d6e' },
    { name: 'Glucides', grams: Math.round((carbsMinG + carbsMaxG) / 2), kcalPerGram: 4, color: '#d4943a' },
    { name: 'Lipides', grams: lipidesG, kcalPerGram: 9, color: '#4a7ab5' },
  ];

  macroBreakdown.forEach(m => { m.totalKcal = m.grams * m.kcalPerGram; });
  const totalKcal = macroBreakdown.reduce((sum, m) => sum + m.totalKcal, 0);

  return (
    <>
      <h2 className="section-title">
        <span className="icon">🧮</span> NUTRIMENTS
      </h2>

      {/* Tableau des nutriments avec kcal */}
      <div className="card" style={{ marginBottom: 25 }}>
        <h3 style={{ marginBottom: 15 }}>🔥 Énergie des nutriments (kcal/gramme)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nutriment</th>
                <th>kcal/gramme</th>
                <th>Sources principales</th>
                <th>Barre</th>
              </tr>
            </thead>
            <tbody>
              {nutrients.map((n, i) => (
                <tr key={i}>
                  <td>
                    <span style={{ marginRight: 8 }}>{n.emoji}</span>
                    <strong>{n.name}</strong>
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: n.color,
                    }}>
                      {n.kcalPerGram} kcal
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.examples}</td>
                  <td style={{ width: '30%' }}>
                    <div style={{
                      height: 8,
                      borderRadius: 4,
                      background: 'var(--bg-secondary)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(n.kcalPerGram / 9) * 100}%`,
                        background: n.color,
                        borderRadius: 4,
                        transition: 'width 0.3s',
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          💡 Les lipides fournissent plus du double l'énergie des protéines et glucides (9 vs 4 kcal/g)
        </p>
      </div>

      {/* Répartition des macros pour ton objectif */}
      <div className="card">
        <h3 style={{ marginBottom: 15 }}>📊 Répartition de tes {totalKcal} kcal/jour</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Macronutriment</th>
                <th>Quantité</th>
                <th>kcal</th>
                <th>% du total</th>
                <th>Barre</th>
              </tr>
            </thead>
            <tbody>
              {macroBreakdown.map((m, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td>{m.grams}g</td>
                  <td style={{ fontWeight: 700, color: m.color }}>{m.totalKcal} kcal</td>
                  <td>{Math.round((m.totalKcal / totalKcal) * 100)}%</td>
                  <td style={{ width: '25%' }}>
                    <div style={{
                      height: 10,
                      borderRadius: 5,
                      background: 'var(--bg-secondary)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(m.totalKcal / totalKcal) * 100}%`,
                        background: m.color,
                        borderRadius: 5,
                        transition: 'width 0.3s',
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 700, borderTop: '2px solid var(--border)' }}>
                <td>Total</td>
                <td>{macroBreakdown.reduce((s, m) => s + m.grams, 0)}g</td>
                <td style={{ color: '#d97757', fontSize: '1.1rem' }}>{totalKcal} kcal</td>
                <td>100%</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
