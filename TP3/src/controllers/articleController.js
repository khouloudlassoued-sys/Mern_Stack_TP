
// On importe les deux modèles :
// - Article : pour manipuler les articles
// - User : pour vérifier que l'auteur existe vraiment avant de créer un article
const Article = require('../models/articleModel');
const User = require('../models/userModel');

// ================================================================
// 1. Récupérer tous les articles avec les infos de l'auteur (GET /api/articles)
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
// 2. Créer un nouvel article lié à un auteur (POST /api/articles)
// ================================================================
const createArticle = async (req, res) => {
    try {
        // Le client envoie authorId = le _id d'un utilisateur existant
        const { title, content, authorId } = req.body;

        // Les 3 champs sont obligatoires
        if (!title || !content || !authorId) {
            return res.status(400).json({ message: 'title, content et authorId sont obligatoires' });
        }

        // Intégrité référentielle : on vérifie que l'auteur existe VRAIMENT dans la collection "users"
        // (MongoDB ne le vérifie pas tout seul, contrairement aux clés étrangères SQL)
        const author = await User.findById(authorId);
        if (!author) {
            return res.status(404).json({ message: 'Auteur non trouve (identifiant authorId invalide)' });
        }

        // Création de l'article : le champ du schéma s'appelle "author", on y met authorId
        const newArticle = await Article.create({ title, content, author: authorId });

        // On "peuple" l'article créé pour renvoyer directement name + email de l'auteur au client
        const populatedArticle = await newArticle.populate('author', 'name email');

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
        // (Exercice 2 : on traitera ici le cas CastError -> 400)
        //Exercice 2 => si l id mal formé =>
        // si le client qui s'est trompé ==> 400 au lieu de 500

        if(err.name=="CastError") {
            return res.status(400).json({ message: 'Identifiant de ressource invalide (format ObjectId attendu)' });
        }
        // Toute autre erreur -> 500
        res.status(500).json({ message: err.message });
    }
};

// ================================================================
// 4. Mettre à jour un article (PUT /api/articles/:id)
// ================================================================
const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,   // quel document modifier
            req.body,        // les nouvelles valeurs (ex: { "title": "Nouveau titre" })
            {
                new: true,           // renvoie le document APRÈS modification (sinon on reçoit l'ancien)
                runValidators: true  // applique aussi les règles du schéma lors d'une mise à jour
            }
        );

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable pour la mise a jour' });
        }

        // On peuple l'auteur avant de répondre
        const populated = await article.populate('author', 'name email');
        res.status(200).json(populated);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
};

// ================================================================
// 5. Supprimer un article (DELETE /api/articles/:id)
// ================================================================
const deleteArticle = async (req, res) => {
    try {
        // findByIdAndDelete() supprime et renvoie le document supprimé (ou null s'il n'existait pas)
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable pour la suppression' });
        }
        res.status(200).json({ message: 'Article supprime avec succes', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Export de toutes les fonctions pour articleRoutes.js
module.exports = {
    getAllArticles,
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle
};


/*
let articles = [
{ id: 1 , title : 'Bienvenue sur le blog ', author : 'Admin'} ,
{ id: 2 , title : 'Mon premier serveur Express ', author : 'Aya' } ,
{ id: 3 , title : 'Tester une API avec Postman ', author : 'Aya' }
];

let prochainId = 4;

const getAllarticles =  (req , res) => {
    const {author} = req.query ; // req.query.author extraire une ou plusieurs propriétés d un objet;
    let resultat = articles ;
    if ( author ) { // si le client a précisé ? author =...

        resultat = articles.filter (a => a.author == author ) ; //retourne un tableau avec ts les éléments qui respectent la condition
        }

    res.json ({ total : resultat.length , articles : resultat }) ;
} ;



const getArticleById = (req , res) => {

    const id = Number(req.params.id) ; // "2" -> 2
    const article = articles.find (a => a.id === id) ;
    //si l 'article n'existe pas (undefined) => raja3li 404
    if (! article ) {
        return res.status(404).json ({ error : 'Article ${id} introuvable ' }) ;
        }
    res.status (200).json (article) ;;
};



const CreateArticle = (req, res) => { 

    const { title, author } = req.body ; // destructuring : extraire les propriétés title et author de l'objet req.body]
    
    if(!title || !author) {
        return res.status(400).json({error : "Le titre et l'auteur sont obligatoires"});
        }

    const nouvelArticle= {id: prochainId, title : title, author : author};
    prochainId= prochainId+1;
    articles.push(nouvelArticle);
    res.status(201).json({message: 'Article crée', article: nouvelArticle});

}

// 4. Mettre à jour un article existant (PUT /api/ articles /: id)
const updateArticle = (req, res) => {
    const id = Number (req.params.id);
    const {title, author} = req.body;

    //rechercher l Index de l article dans le tableau 
    const index = articles.findIndex (a => a.id === id);

    if (index === -1) {
        return res.status(404).json ({ error: `Article ${id} introuvable` });
    }

    if(title) articles[index].title = title; 
    if(author) articles[index].author = author;

    res.status(200).json({message: 'Article mis à jour', article: articles[index]});
}

//Methode delete 
const deleteArticle= (req, res) => {
    const id = Number ( req.params.id) ;
    const articleExiste = articles.some (a=> a.id ===id);

    if (!articleExiste) {
        return res.status(404).json ({ error: `Article ${id} introuvable` });
    }
    //on filtre pour ne garder que les articles ayant un ID diff
    articles = articles.filter (a=> a.id !== id) ;
    res.status(200).json({message: `Article ${id} supprimé avec succès`});

}



// Exportation CommonJS : on rend ces fonctions publiques
module.exports = {
getAllarticles ,
getArticleById ,
CreateArticle,
updateArticle,
deleteArticle
};

*/


