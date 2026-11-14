import React, { useState } from 'react';
import Header from './components/Header';
import Counter from './components/Counter';
import AutoTimer from './components/AutoTimer';
import './index.css';

export default function App() {
  // true = chronomètre affiché (monté), false = masqué (démonté)
  const [showTimer, setShowTimer] = useState(true);

  return (
    <div className="app-container">
      <Header
        titre="Mon Super Compteur React"
        sousTitre="Maîtrise des Hooks fondamentaux useState et useEffect"
      />
      <Counter />

      <button
        className="btn btn-reset"
        style={{ marginTop: '16px' }}
        onClick={() => setShowTimer(!showTimer)}
      >
        {showTimer ? 'Masquer le Chronomètre' : 'Afficher le Chronomètre'}
      </button>

      {showTimer && <AutoTimer />}
    </div>
  );
}