import { useState, useEffect } from 'react';

const STORAGE_KEY = 'musculation_shopping';

function loadState(defaultData) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  // Init from API data
  const init = {
    categories: [
      { id: 'proteins', label: '🥩 Protéines', items: defaultData.proteins || [] },
      { id: 'glucides', label: '🌾 Glucides', items: defaultData.glucides || [] },
      { id: 'legumes', label: '🍌 Légumes/Fruits', items: defaultData.legumes || [] },
      { id: 'lipides', label: '🥑 Lipides', items: defaultData.lipides || [] },
      { id: 'dairy', label: '🧀 Laitiers', items: defaultData.dairy || [] },
    ],
    checked: {},
  };
  return init;
}

export default function ShoppingList({ data }) {
  const [state, setState] = useState(() => loadState(data));
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newItemInputs, setNewItemInputs] = useState({});
  const [showNewCat, setShowNewCat] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggle = (catId, idx) => {
    const key = `${catId}-${idx}`;
    setState(prev => ({
      ...prev,
      checked: { ...prev.checked, [key]: !prev.checked[key] },
    }));
  };

  const addItem = (catId) => {
    const text = (newItemInputs[catId] || '').trim();
    if (!text) return;
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(c =>
        c.id === catId ? { ...c, items: [...c.items, text] } : c
      ),
    }));
    setNewItemInputs(prev => ({ ...prev, [catId]: '' }));
  };

  const removeItem = (catId, idx) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(c =>
        c.id === catId ? { ...c, items: c.items.filter((_, i) => i !== idx) } : c
      ),
      checked: Object.fromEntries(
        Object.entries(prev.checked).filter(([k]) => {
          if (k === `${catId}-${idx}`) return false;
          if (k.startsWith(catId + '-')) {
            const i = parseInt(k.split('-')[1]);
            return i < idx ? true : false; // re-index not needed, keys shift but display is fine
          }
          return true;
        })
      ),
    }));
  };

  const addCategory = () => {
    const label = newCatLabel.trim();
    if (!label) return;
    const id = 'cat_' + Date.now();
    setState(prev => ({
      ...prev,
      categories: [...prev.categories, { id, label, items: [] }],
    }));
    setNewCatLabel('');
    setShowNewCat(false);
  };

  const removeCategory = (catId) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== catId),
      checked: Object.fromEntries(
        Object.entries(prev.checked).filter(([k]) => !k.startsWith(catId + '-'))
      ),
    }));
  };

  const totalItems = state.categories.reduce((sum, c) => sum + c.items.length, 0);
  const totalChecked = state.categories.reduce((sum, c) => {
    return sum + c.items.filter((_, i) => state.checked[`${c.id}-${i}`]).length;
  }, 0);

  return (
    <>
      <h2 className="section-title">
        <span className="icon">🛒</span> LISTE DE COURS
        <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {totalChecked}/{totalItems} articles cochés
        </span>
      </h2>

      <div className="card-grid">
        {state.categories.map(cat => (
          <div className="card" key={cat.id}>
            <div className="card-header">
              <h3>{cat.label}</h3>
              <button
                onClick={() => removeCategory(cat.id)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0 6px',
                }}
                title="Supprimer la catégorie"
              >
                ×
              </button>
            </div>

            {cat.items.map((item, i) => {
              const key = `${cat.id}-${i}`;
              const isChecked = !!state.checked[key];
              return (
                <div
                  className="shopping-item"
                  key={i}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={`checkbox ${isChecked ? 'checked' : ''}`}
                    onClick={() => toggle(cat.id, i)}
                  />
                  <span
                    onClick={() => toggle(cat.id, i)}
                    style={{
                      flex: 1,
                      textDecoration: isChecked ? 'line-through' : 'none',
                      opacity: isChecked ? 0.5 : 1,
                    }}
                  >
                    {item}
                  </span>
                  <button
                    onClick={() => removeItem(cat.id, i)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '0 4px',
                      opacity: 0.5,
                    }}
                    title="Supprimer"
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {/* Ajouter un item */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <input
                type="text"
                placeholder="+ Ajouter un article..."
                value={newItemInputs[cat.id] || ''}
                onChange={e => setNewItemInputs(prev => ({ ...prev, [cat.id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addItem(cat.id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => addItem(cat.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}

        {/* Ajouter une catégorie */}
        <div className="card" style={{ borderStyle: 'dashed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
          {showNewCat ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="🏷️ Nom de la catégorie..."
                value={newCatLabel}
                onChange={e => setNewCatLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCategory()}
                autoFocus
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={addCategory}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--accent)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Ajouter
                </button>
                <button
                  onClick={() => { setShowNewCat(false); setNewCatLabel(''); }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewCat(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1rem',
                fontFamily: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '2rem' }}>+</span>
              <span>Ajouter une catégorie</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
