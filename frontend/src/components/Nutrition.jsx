export default function Nutrition({ data, profile }) {
  const colors = ['#d97757', '#d4943a', '#4a9d6e', '#4a7ab5', '#7c6abf', '#d97757'];

  // Formules associées à chaque nutriment
  const formulas = {
    calories: 'Maintenance + 300-500 kcal',
    proteines: `${parseInt(profile?.poids) || 62} kg × 2g/kg`,
    glucides: `${parseInt(profile?.poids) || 62} kg × 4-5g/kg`,
    lipides: `${parseInt(profile?.poids) || 62} kg × 1g/kg`,
  };

  return (
    <>
      <h2 className="section-title">
        <span className="icon">🍽️</span> PLAN NUTRITIONNEL
      </h2>

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
