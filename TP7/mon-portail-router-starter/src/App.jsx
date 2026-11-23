import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Accueil from './pages/Accueil';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ArticleCreate from './pages/ArticleCreate';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Route parente : tout ce qui est dedans utilise RootLayout */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Accueil />} />                          {/* URL : / */}
        <Route path="articles" element={<ArticleList />} />            {/* URL : /articles */}
        <Route path="articles/:id" element={<ArticleDetail />} />      {/* :id = paramètre dynamique */}
        <Route path="nouveau" element={<ArticleCreate />} />           {/* URL : /nouveau */}
        <Route path="*" element={<NotFound />} />                      {/* toute autre URL : 404 */}
      </Route>
    </Routes>
  );
}