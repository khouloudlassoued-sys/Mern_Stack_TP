const express = require('express'); //#jebna express
const router = express.Router();
const articleController = require('../controllers/articleController');


// Seulement protect : la vérification "auteur ou admin" est faite DANS le contrôleur
//      (il faut d'abord charger l'article pour savoir à qui il appartient)
const { protect } = require('../middlewares/authMiddleware');

// ================================================================
// Consultation PUBLIQUE : tout le monde peut lire
// ================================================================
router.get('/', articleController.getAllArticles);      // GET /api/articles
// Exercice 2 ==>  Route FIXE → OBLIGATOIREMENT avant '/:id'
router.get('/my-articles', protect, articleController.getMyArticles);  // GET /api/articles/my-articles

router.get('/:id', articleController.getArticleById);   // GET /api/articles/:id


// ================================================================
// Opérations d'ÉCRITURE : token obligatoire
// ================================================================
router.post('/', protect, articleController.createArticle);      // POST   /api/articles
router.put('/:id', protect, articleController.updateArticle);    // PUT    /api/articles/:id (auteur ou admin)
router.delete('/:id', protect, articleController.deleteArticle); // DELETE /api/articles/:id (auteur ou admin)




module.exports = router;