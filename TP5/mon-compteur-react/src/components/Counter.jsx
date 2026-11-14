// On importe le Hook useState depuis React
import { useState, useEffect } from 'react';


// Bornes du compteur (hors du composant : elles ne changent jamais)
const MAX = 50;
const MIN = -50;

export default function Counter() {

    // ===== 1. LES ÉTATS (la "mémoire" du composant) =====
    // Chaque useState renvoie [valeur actuelle, fonction pour la modifier]

    // Initialisation paresseuse : on lit le localStorage une seule fois, au démarrage
    const [count, setCount] = useState(() => {
        const sauvegarde = localStorage.getItem('mon_compteur_valeur');
        return sauvegarde !== null ? parseInt(sauvegarde, 10) : 0;
    });
    const [step, setStep] = useState(1);                                  // pas : 1, 2, 5 ou 10
    const [message, setMessage] = useState('Aucun clic pour le moment');  // texte de la dernière action
    const [totalClics, setTotalClics] = useState(0);         
             // nombre total de clics

    // DÉFI 2 : on relit l'historique sauvegardé au démarrage (une seule fois)
    const [historique, setHistorique] = useState(() => {
        const sauvegarde = localStorage.getItem('mon_compteur_historique');
        // JSON.parse transforme la chaîne '["+5","+5"]' en vrai tableau ["+5","+5"]
        return sauvegarde !== null ? JSON.parse(sauvegarde) : [];
    });

    // EFFET A : synchronise le titre de l'onglet (se relance seulement si count change)
    useEffect(() => {
        document.title = 'Compteur : ' + count;
        }, [count]);

    // EFFET B : sauvegarde automatique dans le localStorage (si count change)
    useEffect(() => {
        localStorage.setItem('mon_compteur_valeur', count.toString());
        }, [count]);


    // DÉFI 2 : sauvegarde automatique à chaque changement de l'historique
    useEffect(() => {
        localStorage.setItem('mon_compteur_historique', JSON.stringify(historique));
    }, [historique]);   // <-- historique doit être dans les crochets


    // DÉFI 3 : pilotage du compteur avec les flèches du clavier
    useEffect(() => {
        // Fonction appelée à chaque touche pressée
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();   // évite que la flèche change aussi le menu déroulant ou scrolle la page
                handleIncrement();    // même logique que le bouton +
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                handleDecrement();    // même logique que le bouton -
            }
        };

    // 1. On attache l'écouteur sur toute la fenêtre
    window.addEventListener('keydown', handleKeyDown);

    // 2. NETTOYAGE : on détache l'écouteur (démontage, ou avant de le recréer)
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [count, step, totalClics, historique]);

    // ===== 2. LES GESTIONNAIRES D'ÉVÉNEMENTS =====

    // Clic sur "+"
    const handleIncrement = () => {
        const nouveauCompte = count + step;
        // DÉFI 1 : si on dépasserait le maximum, on bloque et on alerte
        if (nouveauCompte > MAX) {
            setMessage('Seuil maximal de 50 atteint !');
            return; // on quitte la fonction : le reste ne s'exécute pas
        }
        // calcul avec le pas choisi
        setCount(nouveauCompte);              // met à jour le compteur → re-render
        setMessage('Ajout de ' + step);       // met à jour le texte
        setTotalClics(totalClics + 1);        // +1 clic

        const action = '+' + step;            // ex : "+5"
        // IMMUTABILITÉ : on crée un NOUVEAU tableau (copie de l'ancien + l'action)
        // Ne jamais faire historique.push(action) : la référence ne changerait pas
        // et React n'actualiserait pas l'écran
        setHistorique([...historique, action]);
    };

    // Clic sur "-" : même logique en soustrayant
    const handleDecrement = () => {
        const nouveauCompte = count - step;
        // DÉFI 1 : si on passerait sous le minimum, on bloque et on alerte
        if (nouveauCompte < MIN) {
            setMessage('Seuil minimal de -50 atteint !');
            return;
        }
        setCount(nouveauCompte);
        setMessage('Retrait de ' + step);
        setTotalClics(totalClics + 1);

        const action = '-' + step;
        setHistorique([...historique, action]);
    };

    // Clic sur "Reset"
    const handleReset = () => {
        setCount(0);                          // compteur remis à 0
        setMessage('Remise à zéro');
        setTotalClics(totalClics + 1);        // le reset compte comme un clic
        setHistorique([]);                    // nouveau tableau vide
    };

    // ===== 3. LOGIQUE D'AFFICHAGE =====
    // Retourne une classe CSS différente selon le signe du compteur
    const getStyleClass = () => {
        if (count > 0) return 'counter-display positive';   // vert
        if (count < 0) return 'counter-display negative';   // rouge
        return 'counter-display zero';                      // gris
    };

    // ===== 4. LE RENDU JSX =====
    return (
        <div className="counter-card">

            {/* className dynamique : calculé par une fonction JS */}
            <div className={getStyleClass()}>{count}</div>

            <div className="btn-group">
                {/* Le texte du bouton suit le pas : -1, -5, -10... */}
                <button className="btn btn-dec" onClick={handleDecrement}>-{step}</button>
                <button className="btn btn-reset" onClick={handleReset}>Reset</button>
                <button className="btn btn-inc" onClick={handleIncrement}>+{step}</button>
            </div>

            <div className="step-control">
                <label>Pas d'incrémentation : </label>
                {/* COMPOSANT CONTRÔLÉ :
            - value={step} : le select affiche la valeur de l'état
            - onChange : à chaque choix, on met à jour l'état
            - e.target.value est une CHAÎNE ("5") → parseInt la convertit en nombre (5)
              Sans parseInt : 0 + "5" = "05" (concaténation, pas addition !) */}
                <select value={step} onChange={(e) => setStep(parseInt(e.target.value, 10))}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                </select>
            </div>

            <div className="history-card">
                <p><strong>Dernière action :</strong> {message}</p>
                <p><strong>Total des clics :</strong> {totalClics}</p>

                {/* RENDU CONDITIONNEL avec && :
            si historique.length > 0 est faux, rien n'est affiché.
            join(', ') transforme ["+5","+5"] en "+5, +5" */}
                {historique.length > 0 && (
                    <p><strong>Historique :</strong> {historique.join(', ')}</p>
                )}
            </div>
        </div>
    );
}