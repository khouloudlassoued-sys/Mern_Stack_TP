import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = ['Tous', 'Architecture', 'Front-End', 'Back-End'];   // les 4 boutons du défi

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // État LOCAL : le filtre actif n'intéresse que cette page, useState suffit
  const [categorieActive, setCategorieActive] = useState('Tous');

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const res = await api.get('/articles');
        setArticles(res.data);
      } catch (err) {
        setError('Impossible de contacter le serveur Express (port 3000).');
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) return <p>Chargement des articles depuis Express...</p>;
  if (error) return <div style={{ color: 'red' }}>Erreur : {error}</div>;

  // Filtre calculé à l'affichage : le tableau reçu du serveur n'est jamais modifié
  const articlesFiltres =
    categorieActive === 'Tous'
      ? articles
      : articles.filter((a) => a.category === categorieActive);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>Catalogue des Articles ({articlesFiltres.length})</h2>
        <Link to="/nouveau" className="btn-primary">+ Nouvel Article</Link>
      </div>

      {/* Boutons de filtre : celui qui est actif est en bleu plein */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategorieActive(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid #2563eb',
              cursor: 'pointer',
              background: categorieActive === cat ? '#2563eb' : 'white',
              color: categorieActive === cat ? 'white' : '#2563eb'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {articlesFiltres.length === 0 && <p>Aucun article dans cette catégorie.</p>}

      <div className="card-grid">
        {articlesFiltres.map((article) => (
          <div key={article._id} className="card">
            <div>
              <span className="badge">{article.category || 'Non classé'}</span>
              <h3 style={{ fontSize: '1.2rem', margin: '10px 0 6px' }}>{article.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Auteur : {article.author?.name || 'Inconnu'}</p>
              <p style={{ marginTop: '10px', color: '#334155' }}>{article.content}</p>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <Link to={`/articles/${article._id}`} style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
                Lire le detail &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}