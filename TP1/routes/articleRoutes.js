const express = require ('express'); //#jebna express
const router = express.Router();
const articleController = require('../controllers/articleController');


router.get('/', articleController.getAllarticles);
router.get('/:id', articleController.getArticleById);
router.post('/', articleController.CreateArticle);
router.put('/:id', articleController.updateArticle);
router.delete ('/:id', articleController.deleteArticle);


module.exports = router;