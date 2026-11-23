import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();                       // pour rediriger après la suppression
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');             // message si le serveur refuse

  useEffect(() => {
    async function fetchOne() {
      try {
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }
    fetchOne();
  }, [id]);

  // DÉFI 1 : supprimer puis retourner à la liste
  const handleDelete = async () => {
    if (!window.confirm('Supprimer définitivement cet article ?')) return;   // dernière chance d'annuler
    try {
      await api.delete(`/articles/${id}`);              // DELETE /api/articles/:id (jeton envoyé par l'intercepteur)
      navigate('/articles');                            // seulement si le serveur a accepté
    } catch (err) {
      // 403 si tu n'es pas l'auteur, 401 sans jeton, 404 si déjà supprimé...
      setErreur(err.response?.data?.message || 'Suppression impossible : serveur injoignable.');
    }
  };

  if (loading) return <p>Chargement...</p>;

  if (!article) {
    return (
      <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '8px', color: '#b91c1c' }}>
        <h3>Article #{id} introuvable.</h3>
        <Link to="/articles" style={{ color: '#2563eb', display: 'inline-block', marginTop: '10px' }}>&larr; Retour au catalogue</Link>
      </div>
    );
  }

  return (
    <article style={{ background: 'white', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h1 style={{ fontSize: '1.8rem', margin: '12px 0 8px' }}>{article.title}</h1>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>Par <strong>{article.author?.name || 'Inconnu'}</strong> &bull; ID #{article._id}</p>
      <p style={{ lineHeight: 1.7, color: '#1e293b' }}>{article.content}</p>
      {erreur && <p style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginTop: '16px' }}>{erreur}</p>}
      <div style={{ marginTop: '24px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/articles" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>&larr; Retour a la liste</Link>
        <button onClick={handleDelete} style={{ color: '#b91c1c', border: '1px solid #b91c1c', background: 'white', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer' }}>
          Supprimer
        </button>
      </div>
    </article>
  );
}