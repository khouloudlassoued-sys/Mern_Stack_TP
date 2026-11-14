import React, { useState, useEffect } from 'react';

export default function AutoTimer() {
  const [seconds, setSeconds] = useState(0);        // les secondes écoulées
  const [isRunning, setIsRunning] = useState(true); // le chrono tourne-t-il ?

  useEffect(() => {
    let intervalId = null;

    if (isRunning) {
      // 1. Démarrage : toutes les 1000 ms, on ajoute 1 seconde
      intervalId = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    // 2. NETTOYAGE : éteint le timer (changement de isRunning ou démontage)
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]); // l'effet se relance seulement si isRunning change

  return (
    <div className="timer-box">
      <span>
        Chronomètre automatique : <strong>{seconds}s</strong>
      </span>
      <button
        className="btn"
        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? 'Pause' : 'Reprendre'}
      </button>
    </div>
  );
}