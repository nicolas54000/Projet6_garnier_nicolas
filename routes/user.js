// route pour  les utilisateurs

// Express
const express = require("express");

// On crée un router Express
const router = express.Router();

// On associe les fonctions aux différentes routes, on importe le controller
const userCtrl = require("../controllers/user");

const verifyPassword = require("../middleware/verifyPassword");

// Cryptage + ajout de utilisateur à la base
router.post("/signup", verifyPassword, userCtrl.signup);

// Connecte un utilisateur
router.post("/login", userCtrl.login);

module.exports = router;
