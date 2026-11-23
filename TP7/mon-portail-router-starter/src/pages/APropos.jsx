import React from 'react';

export default function APropos() {
  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '14px' }}>À Propos du Module MERN</h2>
      <p style={{ lineHeight: 1.6, color: '#334155', marginBottom: '16px' }}>
        Ce portail illustre l'architecture complète d'une <strong>Single Page Application (SPA)</strong> développée avec <strong>React 19</strong>, <strong>Vite</strong> et <strong>React Router v6</strong>.
      </p>
      <ul style={{ paddingLeft: '20px', lineHeight: 1.8, color: '#475569' }}>
        <li>Navigation déclarative via <code>&lt;Link&gt;</code> et <code>&lt;NavLink&gt;</code>.</li>
        <li>Routes dynamiques avec paramètres d'URL via <code>useParams()</code>.</li>
        <li>Redirections programmatiques avec <code>useNavigate()</code>.</li>
        <li>Layout partagé et persistant grâce à <code>&lt;Outlet /&gt;</code>.</li>
      </ul>
    </div>
  );
}
