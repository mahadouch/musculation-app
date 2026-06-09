export default function Nutrition({ data }) {
  const colors = ['#d97757', '#d4943a', '#4a9d6e', '#4a7ab5', '#7c6abf', '#d97757'];

  return (
    <>
      <h2 className="section-title">
        <span className="icon">🍽️</span> PLAN NUTRITIONNEL
      </h2>

      <div className="card" style={{ marginBottom: 25 }}>
        <h3 style={{ marginBottom: 15 }}>📊 Besoins quotidiens</h3>
        {Object.entries(data.dailyNeeds).map(([key, val], i) => (
          <div className="nutrient-bar" key={i}>
            <span className="nutrient-label" style={{ textTransform: 'capitalize' }}>
              {key === 'proteines' ? 'Protéines' : key === 'glucides' ? 'Glucides' : key === 'lipides' ? 'Lipides' : key}
            </span>
            <span className="nutrient-value">{val}</span>
          </div>
        ))}
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
