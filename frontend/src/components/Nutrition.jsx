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

      {/* 4 Exemples de journées alimentaires */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 15 }}>
        🍳 Exemples de journées alimentaires
      </h3>

      {[
        {
          title: '📋 Journée type (~2650 kcal)',
          tag: 'Standard',
          tagColor: '#d97757',
          meals: data.meals,
        },
        {
          title: '🏋️ Journée entraînement (~2800 kcal)',
          tag: 'Entraînement',
          tagColor: '#4a9d6e',
          meals: [
            { name: '🌅 Petit-déjeuner (7h) - ~500 kcal', items: ['4 œufs brouillés', '2 tranches de pain complet + confiture', '1 banane', '1 verre de jus d\'orange'] },
            { name: '🥜 Collation matin (10h) - ~350 kcal', items: ['Shake whey (30g) + banane', '30g d\'amandes'] },
            { name: '🍽️ Déjeuner (13h) - ~650 kcal', items: ['200g de poulet', '200g de riz (poids cuit)', 'Légumes variés', '1 cuillère d\'huile d\'olive'] },
            { name: '⚡ Pré-entraînement (16h) - ~400 kcal', items: ['150g de flocons d\'avoine', '1 banane', '1 café'] },
            { name: '🥩 Post-entraînement (18h30) - ~600 kcal', items: ['200g de bœuf haché 5%', '250g de pâtes', 'Légumes grillés'] },
            { name: '🧀 Avant le coucher (21h) - ~300 kcal', items: ['Fromage blanc 0% (200g)', 'Noix de cajou (20g)', '1 fruit'] },
          ],
        },
        {
          title: '💤 Journée repos (~2500 kcal)',
          tag: 'Repos',
          tagColor: '#4a7ab5',
          meals: [
            { name: '🌅 Petit-déjeuner (8h) - ~450 kcal', items: ['3 œufs + 2 blancs (omelette)', '1 tranche de pain complet', '1 avocat (½)', 'Café sans sucre'] },
            { name: '🥜 Collation (11h) - ~300 kcal', items: ['Yaourt grec (150g)', 'Granola (30g)', 'Fruits rouges'] },
            { name: '🍽️ Déjeuner (13h) - ~600 kcal', items: ['200g de saumon', '150g de riz basmati', 'Salade verte + concombre', '10g d\'huile de colza'] },
            { name: '🍌 Collation (16h) - ~350 kcal', items: ['2 tartines de pain complet', 'Beurre de cacahuète (1 cuillère)', '1 pomme'] },
            { name: '🥩 Dîner (19h30) - ~550 kcal', items: ['200g de dinde', '200g de patate douce', 'Légumes vapeur', '1 cuillère d\'huile d\'olive'] },
            { name: '🧀 Avant le coucher (21h30) - ~250 kcal', items: ['Cottage cheese (150g)', 'Noix (20g)', '1 kiwi'] },
          ],
        },
        {
          title: '🔥 Journée masse (~3000 kcal)',
          tag: 'Surplus',
          tagColor: '#7c6abf',
          meals: [
            { name: '🌅 Petit-déjeuner (7h) - ~600 kcal', items: ['5 œufs (3 entiers + 2 blancs)', '3 tranches de pain complet + beurre de cacahuète', '1 banane + 1 kiwi', 'Verre de lait (250ml)'] },
            { name: '🥜 Collation matin (10h) - ~400 kcal', items: ['Shake masse (whey + avoine + banane + lait)', 'Poignée de noix (40g)'] },
            { name: '🍽️ Déjeuner (13h) - ~750 kcal', items: ['250g de poulet ou thon', '250g de riz (poids cuit)', 'Légumes variés au four', '2 cuillères d\'huile d\'olive'] },
            { name: '🍌 Collation après-midi (16h) - ~400 kcal', items: ['3 tartines de pain complet', 'Beurre de cacahuète (2 cuillères)', '1 banane + 1 pomme'] },
            { name: '🥩 Dîner (19h) - ~600 kcal', items: ['250g de steak ou côte de bœuf', '200g de pâtes complètes', 'Légumes grillés', '10g d\'huile d\'olive'] },
            { name: '🧀 Avant le coucher (21h30) - ~250 kcal', items: ['Fromage blanc (200g)', 'Miel (1 cuillère)', 'Noix de cajou (30g)'] },
          ],
        },
        {
          title: '💰 Journée économique (~2600 kcal)',
          tag: 'Budget',
          tagColor: '#d4943a',
          meals: [
            { name: '🌅 Petit-déjeuner (7h) - ~500 kcal', items: ['4 œufs brouillés', '2 tranches de pain de mie', '1 banane', 'Lait (250ml)'] },
            { name: '🥜 Collation matin (10h) - ~300 kcal', items: ['Flocons d\'avoine (80g) + lait', '1 cuillère de miel'] },
            { name: '🍽️ Déjeuner (13h) - ~650 kcal', items: ['200g de cuisse de poulet (pilons)', '200g de riz basmati', 'Légumes surgelés (haricots verts)', '1 cuillère d\'huile de tournesol'] },
            { name: '🍌 Collation (16h) - ~350 kcal', items: ['2 œufs durs', '2 tartines de pain complet', '1 pomme'] },
            { name: '🥩 Dîner (19h30) - ~600 kcal', items: ['200g de thon en conserve', '200g de pâtes', 'Sauce tomate maison', '1 cuillère d\'huile d\'olive'] },
            { name: '🧀 Avant le coucher (21h30) - ~200 kcal', items: ['Fromage blanc (150g)', 'Noix de cajou (20g)'] },
          ],
        },
      ].map((plan, pi) => (
        <div className="card" key={pi} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
            <h4 style={{ margin: 0 }}>{plan.title}</h4>
            <span className="tag" style={{ background: `${plan.tagColor}18`, color: plan.tagColor }}>{plan.tag}</span>
          </div>
          <div className="card-grid">
            {plan.meals.map((meal, i) => (
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
        </div>
      ))}
    </>
  );
}
