import React, { useState } from 'react';
import Workouts from './Workouts';
import Calculator from './Calculator';
import FitBot from './FitBot';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('workouts');

  return (
    <div>
      {/* HERO */}
      <header className="hero">
        <div className="hero-content">
          <h1>FitLife Pro</h1>
          <p>Your complete fitness companion with personalized workouts, nutrition tracking, and calorie support</p>
        </div>
      </header>

      {/* TAB NAVIGATION */}
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          💪 Workouts
        </button>
        <button
          className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          🧮 Calculator
        </button>
      </nav>

      {/* CONTENT */}
      <main className="main-content">
        {activeTab === 'workouts' && <Workouts />}
        {activeTab === 'calculator' && <Calculator />}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-logo">💪 FitLife Pro</p>
        <p>Transform your fitness journey with personalized workouts and smart nutrition tracking.</p>
        <p className="footer-copy">© 2024 FitLife Pro. Your health and fitness partner.</p>
      </footer>

      {/* FITBOT CHATBOT */}
      <FitBot />
    </div>
  );
}

export default App;
