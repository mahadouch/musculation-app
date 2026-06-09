export default function Nutrition({ data, profile }) {
  const colors = ['#d97757', '#d4943a', '#4a9d6e', '#4a7ab5', '#7c6abf', '#d97757'];
  const poids = parseInt(profile?.poids) || 62;

  // Formules associées à chaque nutriment
  const formulas = {
    calories: 'Maintenance + 300-500 kcal',
    proteines: `${poids} kg × 2g/kg`,
    glucides: `${poids} kg × 4-5g/kg`,
    lipides: `${poids} kg × 1g/kg`,
  };

  // kcal/gramme
  const nutrients = [
    { name: 'Protéines', kcalPerGram: 4, color: '#4a9d6e', emoji: '🥩', examples: 'Poulet, œufs, poisson, whey, tofu' },
    { name: 'Glucides', kcalPerGram: 4, color: '#d4943a', emoji: '🍚', examples: 'Riz, pâtes, pain, fruits, patate douce' },
    { name: 'Lipides', kcalPerGram: 9, color: '#4a7ab5', emoji: '🥑', examples: 'Huile d\'olive, noix, avocat, beurre de cacahuète' },
    { name: 'Alcool', kcalPerGram: 7, color: '#c45c5c', emoji: '🍺', examples: 'Bière, vin, cocktails (à limiter)' },
  ];

  // Répartition des macros
  const dailyNeeds = data.dailyNeeds || {};
  const proteinG = parseInt(dailyNeeds.proteines) || poids * 2;
  const carbsMinG = parseInt(dailyNeeds.glucides) || poids * 4;
  const carbsMaxG = carbsMinG + poids;
  const lipidesG = parseInt(dailyNeeds.lipides) || poids;

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
        <span className="icon">🍽️</span> PLAN NUTRITIONNEL
      </h2>

      {/* Besoins quotidiens + formules */}
      <div className="card" style={{ marginBottom: 25 }}>
        <h3 style={{ marginBottom: 15 }}>📊 Besoins quotidiens</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nutriment</th>
                <th>Quantité</th>
                <th>Formule de calcul</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.dailyNeeds).map(([key, val], i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: colors[i % colors.length] }}>
                    {key === 'calories' ? '🔥 Calories' :
                     key === 'proteines' ? '🥩 Protéines' :
                     key === 'glucides' ? '🍚 Glucides' :
                     key === 'lipides' ? '🥑 Lipides' : key}
                  </td>
                  <td style={{ fontWeight: 700 }}>{val}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {formulas[key] || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Énergie des nutriments kcal/g */}
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
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: n.color }}>
                      {n.kcalPerGram} kcal
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.examples}</td>
                  <td style={{ width: '30%' }}>
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(n.kcalPerGram / 9) * 100}%`, background: n.color, borderRadius: 4 }} />
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

      {/* Répartition des macros */}
      <div className="card" style={{ marginBottom: 25 }}>
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
                    <div style={{ height: 10, borderRadius: 5, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(m.totalKcal / totalKcal) * 100}%`, background: m.color, borderRadius: 5 }} />
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

      {/* Exemple de journée alimentaire */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 15 }}>
        🍳 Exemple de journée alimentaire
      </h3>
      <div className="card-grid">
        {data.meals.map((meal, i) => (
          <div className="meal-card" key={i}>
            <h4>{meal.name}</h4>
            <ul>
              {meal.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
