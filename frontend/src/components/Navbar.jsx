export default function Navbar({ sections, activeSection, setActiveSection, isOpen, onToggle, onClose }) {
  return (
    <>
      {/* Hamburger button — visible only on mobile */}
      <button
        className={`hamburger ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Backdrop — closes sidebar when clicked */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <nav className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">🏋️</span>
          <span className="sidebar-brand-text">MUSCU APP</span>
        </div>
        <div className="sidebar-nav">
          {sections.map(s => (
            <button
              key={s.id}
              className={`sidebar-btn ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => { setActiveSection(s.id); onClose(); }}
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
    </>
  );
}
