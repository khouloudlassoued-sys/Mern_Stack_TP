// Composant fonctionnel : reçoit les props "titre" et "sousTitre"
// (déstructuration de l'objet props directement dans les paramètres)

export default function Header({ titre, sousTitre }) {

    // ZONE A : logique JavaScript pure → formatage de la date en français
    const dateDuJour = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // ZONE B : ce que le composant retourne (JSX)
    return (
        <header className="header">
            <h1>{titre}</h1>          {/* {} = insertion d'une variable JS */}
            <p>{sousTitre}</p>
            {/* style en JSX = objet JS → double accolades {{ }} */}
            <small style={{ color: '#94a3b8', display: 'block', marginTop: '6px' }}>
                Date de la session : {dateDuJour}
            </small>
        </header>
    );
}