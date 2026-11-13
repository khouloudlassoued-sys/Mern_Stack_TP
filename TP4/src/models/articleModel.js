// On importe Mongoose
const mongoose = require('mongoose');

// SCHÉMA de l'article
const articleSchema = new mongoose.Schema(
    {
        // Titre : texte obligatoire, nettoyé des espaces
        title: {
            type: String,
            required: [true, 'Le titre est obligatoire'],
            trim: true
        },

        // Contenu : texte obligatoire
        content: {
            type: String,
            required: [true, 'Le contenu est obligatoire']
        },

        // Auteur : RELATION One-to-Many (1 user -> N articles)
        // On ne stocke PAS tout l'utilisateur, seulement son _id (une "référence", comme une clé étrangère en SQL)
        author: {
            type: mongoose.Schema.Types.ObjectId,  // type spécial MongoDB : identifiant de 24 caractères hexadécimaux
            ref: 'User',                           // indique à quel modèle ce _id appartient -> permet d'utiliser .populate('author')
            required: [true, "L'auteur (authorId) est obligatoire"]
        }
    },
    { timestamps: true }  // createdAt + updatedAt automatiques
);

// MODÈLE 'Article' -> collection "articles" dans MongoDB
module.exports = mongoose.model('Article', articleSchema);