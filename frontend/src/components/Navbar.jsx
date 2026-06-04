export default function Navbar({ sections, activeSection, setActiveSection }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">🏋️</span>
        <span className="sidebar-brand-text">MUSCU APP</span>
      </div>
      <div className="sidebar-nav">
        {sections.map(s => (
          <button
            key={s.id}
            className={`sidebar-btn ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            <span className="sidebar-btn-icon">{s.icon}</span>
            <span className="sidebar-btn-label">{s.label.replace(/^[^\s]+\s/, '')}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-footer">
        <span>v4.0</span>
      </div>
    </nav>
  );
}
