const API_BASE = window.location.hostname === 'localhost' && window.location.port === '5173'
  ? 'http://localhost:3001'
  : '';

export async function fetchProgram() {
  const res = await fetch(`${API_BASE}/api/program`);
  if (!res.ok) throw new Error('Erreur lors du chargement du programme');
  return res.json();
}

export async function fetchMarkdown() {
  const res = await fetch(`${API_BASE}/api/markdown`);
  if (!res.ok) throw new Error('Erreur lors du chargement du markdown');
  return res.json();
}
