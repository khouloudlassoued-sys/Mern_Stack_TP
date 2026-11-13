
//protect => va vérifier que la requète contient un token valide sinon 401 => vérifier l authentification
//adminOnly => vérifie que l utilisateur est admin sinon 403
///////// Order Protect ===> AdminOnly ==> Controleur

//protect : extait le Token => le vérifie => charger user dans req.user => next() ou renvoie 401 unauthorized
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// ============================================================
// 1. Middelware protect : vérifie l'identité (authentification) Qui es-tu ?
// ============================================================

const protect = async (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Vérifie la signature avec la clé secrète ET la date d'expiration.
            // Si c'est OK : renvoie le payload décodé → { id, role, iat, exp }
            // Si c'est KO (token modifié, faux secret, expiré) : lève une exception → catch
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Récupère l'utilisateur en base, SANS le mot de passe,
            // et l'attache à la requête pour les middlewares et contrôleurs suivants
            req.user = await User.findById(decoded.id).select('-password');

            // Cas où le token est valide mais le compte a été supprimé entre-temps
            if (!req.user) {
                return res.status(401).json({message: 'Non autorise, utilisateur introuvable'});
            }
            return next();

        } catch (err) {
            // jwt.verify a échoué (signature invalide, token expiré, token mal formé…)
            return res.status(401).json({message: 'Non autorise, token invalide ou expire'});

        }
    }
        // Aucun en-tête Authorization (ou pas au format Bearer)
        return res.status(401).json({message: 'Non autorise, aucun token fourni'});

    } ;



// ============================================================
// 2. Middelware adminOnly : vérifie les droits (autorisation ) As-tu le droit ?
// Doit TOUJOURS être placé APRÈS protect, car il utilise req.user
//lit req.user.role si c est admin => next() sinon 403 Forbidden
// ============================================================

const adminOnly = (req, res, next) => {

    if(req.user && req.user.role === 'admin') {

        return next(); //admin=> accès autorisé
    }
    // Identité connue, mais droits insuffisants
    return res.status(403).json({ message: 'Acces refuse : droits administrateur requis' });
} ;

module.exports = { protect, adminOnly };









