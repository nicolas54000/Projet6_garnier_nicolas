

// import  mongoose
const mongoose = require('mongoose');


// On rajoute ce validateur comme plugin
// package qui valide l'unicité du log
const uniqueValidator = require('mongoose-unique-validator');


// On crée notre schéma de données dédié à l'utilisateur
const userSchema = mongoose.Schema({
  // L'email doit être unique
  email: {
    type: String,
    unique: true,
    required: [true, "Veuillez entrer votre adresse email"],
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, " Mail incorrecte"]
  },
  // enregistrement du mot de pass
  password: {
    type: String,
    required: [true, "Entrez un mot de passe"]
  }
});

// Plugin pour garantir un email unique

userSchema.plugin(uniqueValidator);


// On exporte ce schéma sous forme de modèle : le modèle s'appellera user et on lui passe le shéma de données
module.exports = mongoose.model('User', userSchema);

