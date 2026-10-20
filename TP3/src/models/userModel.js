// On importe Mongoose : c'est l'ODM qui fait le lien entre notre code JS et MongoDB
const mongoose = require('mongoose');

// 1. SCHÉMA = le "plan" du document : il définit les champs, leurs types et leurs règles de validation////
const userSchema = new mongoose.Schema(
    {
        // Champ "name" : texte obligatoire
        name: {
            type: String,                                  // type texte
            required: [true, 'Le nom est obligatoire'],    // obligatoire + message d'erreur personnalisé
            trim: true                                     // supprime les espaces au début et à la fin ("  Aya  " -> "Aya")
        },

        // Champ "email" : texte obligatoire, unique et au bon format
        email: {
            type: String,
            required: [true, "L'email est obligatoire"],
            unique: true,        // crée un index d'unicité dans MongoDB : deux users ne peuvent pas avoir le même email
            lowercase: true,     // convertit en minuscules avant l'enregistrement ("AYA@X.TN" -> "aya@x.tn")
            trim: true,
            // Validation de forme par Regex :
            // ^[^\s@]+  -> au moins 1 caractère qui n'est ni un espace ni un @ (partie avant le @)
            // @         -> un @ obligatoire
            // [^\s@]+   -> le domaine (ex: polytechnique)
            // \.        -> un point obligatoire
            // [^\s@]+$  -> l'extension (ex: tn, com) jusqu'à la fin
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Format d'email invalide (ex: aya@polytechnique.tn)"]
        },

        // Champ "password" : texte obligatoire, longueur minimale de 6 caractères
        // (stocké en clair pour l'instant -> il sera haché avec bcrypt en Séance 4)
        password: {
            type: String,
            required: [true, 'Le mot de passe est obligatoire'],                    // obligatoire
            minlength: [6, 'Le mot de passe doit comporter au moins 6 caracteres']     // si < 6 caractères -> ValidationError
        },

        // Champ "age" : nombre optionnel, avec un minimum
        age: {
            type: Number,
            min: [4, "L'age minimum autorise est de 4 ans"]  // si age < 4 -> ValidationError
        },

        // Champ "role" : limité à une liste fermée de valeurs (énumération)
        role: {
            type: String,
            enum: {
                values: ['user', 'admin'],                      // seules ces 2 valeurs sont acceptées
                message: "{VALUE} n'est pas un role autorise"   // {VALUE} est remplacé par la valeur refusée
            },
            default: 'user'   // si le client n'envoie pas de role -> 'user' par défaut
        },

        // Champ "bio" (Exercice 1) : texte optionnel, limité à 200 caractères
        bio: {
            type: String,
            trim: true,
            maxlength: [200, 'La biographie ne peut pas dépasser 200 caractères']  // si > 200 caractères -> ValidationError
        },

        // Champ "phone" (Exercice 1) : texte optionnel, exactement 8 chiffres
        phone: {
            type: String,     // String et non Number : pour garder les 0 en tête et éviter les calculs
            trim: true,
            // Regex : ^\d{8}$ -> exactement 8 chiffres (0-9), du début à la fin, rien d'autre
            match: [/^\d{8}$/, 'Numéro de 8 chiffres requis']
        }
    },

    { timestamps: true }  // ajoute automatiquement createdAt (date de création) et updatedAt (date de dernière modif)
);

// 2. MODÈLE = le schéma "compilé" : c'est la classe qui possède les méthodes find(), create(), findById()...
// 'User' -> Mongoose crée automatiquement la collection "users" (au pluriel, en minuscules)
module.exports = mongoose.model('User', userSchema);