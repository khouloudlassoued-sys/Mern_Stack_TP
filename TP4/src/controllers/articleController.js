// On importe les deux modèles :
// - Article : pour manipuler les articles
// - User : pour vérifier que l'auteur existe vraiment avant de créer un article

// User n'est plus nécessaire ici : l'existence de l'auteur est garantie par le middleware protect
//      (il a déjà chargé l'utilisateur depuis la base dans req.user)


const Article = require('../models/articleModel');
// const User = require('../models/userModel');

// ================================================================
// 1. Récupérer tous les articles avec les infos de l'auteur (GET /api/articles)
// Route publique (pas de protect)
// ================================================================
const getAllArticles = async (req, res) => {
    try {
        // find() -> tous les articles
        // .populate('author', 'name email') -> remplace l'ObjectId stocké dans "author"
        //    par le vrai document User, en ne gardant que les champs name et email
        //    (c'est la "jointure" de MongoDB)
        const articles = await Article.find().populate('author', 'name email');
        res.status(200).json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ================================================================
//Exercice 2 Articles de l'utilisateur connecté (GET /api/articles/my-articles) → protect
// ================================================================
const getMyArticles = async (req, res) => {
    try {
        // Filtre : seulement les articles dont l'auteur est l'utilisateur du token
        // req.user._id est fiable (token signé + vérifié par protect)
        const articles = await Article.find({ author: req.user._id })
            .populate('author', 'name email')  // infos de l'auteur
            .sort({ createdAt: -1 });          // du plus récent au plus ancien

        // 200 même si la liste est vide ([]) : ce n'est pas une erreur, l'utilisateur n'a juste rien publié
        res.status(200).json({ total: articles.length, articles });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ================================================================
// 2. Créer un nouvel article lié à un auteur (POST /api/articles)
//  Route protégée (protect) : l'auteur = l'utilisateur connecté
// ================================================================
const createArticle = async (req, res) => {
    try {
        // On ne lit PLUS authorId dans le body : le client pourrait mentir !
        const { title, content } = req.body;

        // [S4] title et content obligatoires (authorId n'est plus demandé)
        if (!title || !content) {
            return res.status(400).json({ message: 'Titre et contenu obligatoires' });
        }

        // Ancienne vérification d'intégrité référentielle supprimée :
        //  req.user vient d'un token signé + d'une lecture en base dans protect → l'auteur existe forcément

        // L'auteur est extrait du token vérifié : usurpation impossible !
        const newArticle = await Article.create({ title, content, author: req.user._id });

        // On "peuple" l'article créé pour renvoyer directement name + email de l'auteur au client
        // [S4] + role
        const populatedArticle = await newArticle.populate('author', 'name email role');

        res.status(201).json(populatedArticle); // 201 = Created
    } catch (err) {
        // Données refusées par le schéma (titre vide...) -> 400
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
};






// ================================================================
// 3. Récupérer un article unique par son ID (GET /api/articles/:id)
//Route publique
// ================================================================
const getArticleById = async (req, res) => {
    try {
        // findById + populate -> l'article avec les infos de son auteur
        const article = await Article.findById(req.params.id).populate('author', 'name email');

        if (!article) {
            return res.status(404).json({ message: 'Article non trouve' });
        }
        res.status(200).json(article);
    } catch (err) {
        //Exercice 2 => si l id mal formé =>
        // si le client qui s'est trompé ==> 400 au lieu de 500
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Identifiant de ressource invalide (format ObjectId attendu)' });
        }
        // Toute autre erreur -> 500
        res.status(500).json({ message: err.message });
    }
};

// ================================================================
// 4. Mettre à jour un article (PUT /api/articles/:id)
// Route protégée : seul l'AUTEUR ou un ADMIN peut modifier
// ================================================================
const updateArticle = async (req, res) => {
    try {
        //  On ne fait plus findByIdAndUpdate directement :
        //      il faut d'abord LIRE l'article pour savoir à qui il appartient
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable pour la mise a jour' });
        }

        // [S4] Vérification des droits de propriété
        // article.author et req.user._id sont des ObjectId (des objets) :
        // on les convertit en chaînes avec toString() pour comparer leurs VALEURS
        if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Action interdite : vous n'etes pas l'auteur de cet article"
            }); // 403 = authentifié mais pas autorisé
        }

        //  On modifie UNIQUEMENT title et content (et non req.body entier)
        //      → impossible de changer le champ "author" via la requête
        //      Si un champ n'est pas envoyé, on garde l'ancienne valeur
        article.title = req.body.title || article.title;
        article.content = req.body.content || article.content;

        //save() applique automatiquement les validateurs du schéma (équivalent de runValidators)
        const updated = await article.save();

        // On peuple l'auteur avant de répondre
        const populated = await updated.populate('author', 'name email role');
        res.status(200).json(populated);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        // [S4] id mal formé -> 400
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Identifiant invalide' });
        }
        res.status(500).json({ message: err.message });
    }
};

// ================================================================
// 5. Supprimer un article (DELETE /api/articles/:id)
// [S4] Route protégée : seul l'AUTEUR ou un ADMIN peut supprimer
// ================================================================
const deleteArticle = async (req, res) => {
    try {
        // [S4] On lit d'abord l'article pour vérifier le propriétaire
        //      (avant : on supprimait directement, sans aucun contrôle)
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable pour la suppression' });
        }

        // [S4] Même vérification que pour la mise à jour
        if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Action interdite : vous n'etes pas l'auteur de cet article"
            });
        }

        // findByIdAndDelete() supprime le document
        await Article.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Article supprime avec succes', id: req.params.id });
    } catch (err) {
        // [S4] id mal formé -> 400
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Identifiant invalide' });
        }
        res.status(500).json({ message: err.message });
    }
};

// Export de toutes les fonctions pour articleRoutes.js
module.exports = {
    getAllArticles,
    getMyArticles,
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle
};