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

// Tracking entries
export async function fetchTrackingEntries() {
  const res = await fetch(`${API_BASE}/api/tracking/entries`);
  if (!res.ok) throw new Error('Erreur lors du chargement des entrées');
  return res.json();
}

export async function createTrackingEntry(entry) {
  const res = await fetch(`${API_BASE}/api/tracking/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Erreur lors de la création de l'entrée");
  return res.json();
}

export async function deleteTrackingEntry(id) {
  const res = await fetch(`${API_BASE}/api/tracking/entries/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression de l'entrée");
  return res.json();
}
