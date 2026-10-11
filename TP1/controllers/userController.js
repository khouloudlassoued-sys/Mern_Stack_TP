const { estNonVide, estEmailValide } = require('../utils/validators');


let users = [
        {id: 1, name: "Khouloud", email: "khouloud@example.com", role :"Ingenieur"},
        {id: 2, name: "Aya", email: "aya@example.com", role :"Etudiant" },
        {id: 3, name: "Ahmed", email: "ahmed@example.com", role :"Enseignant"}
        ]

let prochainId = 5;


const getAllUsers =(req,res) => {
    const {name} = req.query;
    let result = users;
    if (name) {
        result = users.filter (u => u.name === name);
    }

    res.json({users: result});

}

const getUserById = (req,res) =>{

    const id =Number (req.params.id);
    const user = users.find (u=> u.id ===id);
    if (!user) {
        res.status(404).json({error: `Utilisateur ${id} introuvable`});
    }

    res.json({user: user});
}

//validation obligatoire de name et email, statut 201
const CreateUser = (req, res) => {
    const {name, email, role} = req.body; //  destructuring : extraire les propriétés name et email de l'objet req.body]

    if (!estNonVide(name)) {
        return res.status(400).json({ error: "Le nom est obligatoire et ne peut pas être vide" });
    }
    if (!estEmailValide(email)) {
        return res.status(400).json({ error: "L'email est invalide (il doit contenir @ et .)" });
    }

    const newUser = {id:prochainId, name: name, email:email, role:role};
    prochainId = prochainId+1 ; 
    users.push(newUser);
    res.status(201).json({message: 'Utilisateur créé', user: newUser});

}



//Methode delete 
const deleteUser= (req, res) => {
    const id = Number ( req.params.id) ;
    const UserExiste = users.some (a=> a.id ===id);

    if (!UserExiste) {
        return res.status(404).json ({ error: `User ${id} introuvable` });
    }
    //on filtre pour ne garder que les articles ayant un ID diff
    users = users.filter (a=> a.id !== id) ;
    res.status(200).json({message: `User ${id} supprimé avec succès`});

}



module.exports = {
    getAllUsers,
    getUserById,
    CreateUser,
    deleteUser,

}

