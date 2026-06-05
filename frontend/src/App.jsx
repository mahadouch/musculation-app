import { useState, useEffect } from 'react';
import { fetchProgram } from './api';
import './App.css';

import Profile from './components/Profile';
import Objectives from './components/Objectives';
import WorkoutDays from './components/WorkoutDays';
import Nutrition from './components/Nutrition';
import Warmup from './components/Warmup';
import Recovery from './components/Recovery';
import Schedule from './components/Schedule';
import GoldenRules from './components/GoldenRules';
import ErrorsToAvoid from './components/ErrorsToAvoid';
import ShoppingList from './components/ShoppingList';
import Supplements from './components/Supplements';
import Progression from './components/Progression';
import Videos from './components/Videos';
import Tracking from './components/Tracking';
import Cycling from './components/Cycling';
import Navbar from './components/Navbar';

function App() {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProgram()
      .then(data => {
        setProgram(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p>Chargement du programme...</p>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      <h2>❌ Erreur</h2>
      <p>{error}</p>
      <p>Vérifie que le serveur backend est lancé sur le port 3001</p>
    </div>
  );

  const sections = [
    { id: 'profile', label: '👤 Profil', icon: '👤' },
    { id: 'objectives', label: '🎯 Objectifs', icon: '🎯' },
    { id: 'schedule', label: '📅 Planning', icon: '📅' },
    { id: 'workouts', label: '🏋️ Entraînement', icon: '🏋️' },
    { id: 'warmup', label: '🔥 Échauffement', icon: '🔥' },
    { id: 'nutrition', label: '🍽️ Nutrition', icon: '🍽️' },
    { id: 'goldenrules', label: '⭐ Règles d\'or', icon: '⭐' },
    { id: 'errors', label: '⚠️ Erreurs', icon: '⚠️' },
    { id: 'recovery', label: '💆 Récupération', icon: '💆' },
    { id: 'progression', label: '📈 Progression', icon: '📈' },
    { id: 'videos', label: '🎬 Vidéos', icon: '🎬' },
    { id: 'supplements', label: '💊 Suppléments', icon: '💊' },
    { id: 'shopping', label: '🛒 Courses', icon: '🛒' },
    { id: 'tracking', label: '📓 Suivi', icon: '📓' },
    { id: 'cycling', label: '🚴 Cyclisme', icon: '🚴' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <>
            <header className="hero">
              <h1>🏋️ PROGRAMME DE PRISE DE POIDS</h1>
              <p className="subtitle">Débutant • 37 ans • Objectif 75-80 kg de muscle sec</p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-value">62 kg</span>
                  <span className="stat-label">Poids actuel</span>
                </div>
                <div className="stat">
                  <span className="stat-value">75-80 kg</span>
                  <span className="stat-label">Objectif</span>
                </div>
                <div className="stat">
                  <span className="stat-value">2800 kcal</span>
                  <span className="stat-label">Calories/jour</span>
                </div>
                <div className="stat">
                  <span className="stat-value">3 jours</span>
                  <span className="stat-label">Musculation/sem</span>
                </div>
              </div>
            </header>
            <Profile data={program.profile} />
          </>
        );
      case 'objectives':
        return <Objectives data={program.objectives} />;
      case 'schedule':
        return <Schedule data={program.schedule} />;
      case 'workouts':
        return <WorkoutDays days={program.days} />;
      case 'warmup':
        return <Warmup data={program.warmup} />;
      case 'nutrition':
        return <Nutrition data={program.nutrition} />;
      case 'goldenrules':
        return <GoldenRules data={program.goldenRules} />;
      case 'errors':
        return <ErrorsToAvoid data={program.errorsToAvoid} />;
      case 'recovery':
        return <Recovery data={program.recovery} />;
      case 'progression':
        return <Progression data={program.progression} />;
      case 'videos':
        return <Videos data={program.videos} />;
      case 'supplements':
        return <Supplements data={program.supplements} />;
      case 'shopping':
        return <ShoppingList data={program.shoppingList} />;
      case 'tracking':
        return <Tracking data={program.tracking} />;
      case 'cycling':
        return <Cycling data={program.schedule} />;
      default:
        return <Profile data={program.profile} />;
    }
  };

  return (
    <div className="app">
      <Navbar
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <div className="section-wrapper" key={activeSection}>
          {renderSection()}
        </div>

        <footer className="footer">
          <p>Document créé le : 02/06/2026 • Dernière mise à jour : 04/06/2026</p>
          <p>Version 4.0 — Programme de Prise de Poids Débutant</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
