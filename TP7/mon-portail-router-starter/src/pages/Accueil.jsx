import React from 'react';
import { Link } from 'react-router-dom';

export default function Accueil() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <h2 style={{ fontSize: '2.4rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '14px' }}>
        Portail de Recherche & Publications MERN
      </h2>
      <p style={{ fontSize: '1.15rem', color: '#475569', maxWidth: '650px', margin: '0 auto 28px' }}>
        Bienvenue sur la plateforme Single Page Application (SPA). Naviguez instantanément entre les catalogues de recherche, la lecture d'articles et la soumission de travaux sans rechargement de page.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
        <Link to="/articles" className="btn-primary">
          Explorer les Articles &rarr;
        </Link>
        <Link to="/nouveau" style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', textDecoration: 'none', color: '#0f172a', fontWeight: '600' }}>
          Publier un Travail
        </Link>
      </div>
    </div>
  );
}
