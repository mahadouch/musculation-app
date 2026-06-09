export default function Objectives({ data }) {
  const items = [
    { label: 'Prise de poids', value: data.prise_de_poids, color: '#d97757', percent: 30 },
    { label: 'Calories', value: data.calories, color: '#d97757', percent: 80 },
    { label: 'Protéines', value: data.proteines, color: '#4a9d6e', percent: 60 },
    { label: 'Glucides', value: data.glucides, color: '#d4943a', percent: 90 },
    { label: 'Lipides', value: data.lipides, color: '#4a7ab5', percent: 25 },
  ];

  return (
    <>
      <h2 className="section-title">
        <span className="icon">🎯</span> OBJECTIFS NUTRITIONNELS
      </h2>
      <div className="card">
        {items.map((item, i) => (
          <div className="nutrient-bar" key={i}>
            <span className="nutrient-label">{item.label}</span>
            <span className="nutrient-value">{item.value}</span>
            <div className="nutrient-bar-visual">
              <div
                className="nutrient-fill"
                style={{ width: `${item.percent}%`, background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
