import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: '900', color: '#2563eb', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '12px', marginBottom: '8px' }}>Page Non Trouvée</h2>
      <p style={{ color: '#64748b', maxWidth: '450px', margin: '0 auto 24px' }}>
        L'adresse demandée n'existe pas ou a été déplacée sur ce portail.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: 'white' }}>
          &larr; Page Précédente
        </button>
        <Link to="/" className="btn-primary">
          Retour à l'Accueil
        </Link>
      </div>
    </div>
  );
}
