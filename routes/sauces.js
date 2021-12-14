//routes pour les sauces
// la logique de routing et la logique métier se trouve dans le controller sauce.js

// Express
const express = require("express");
// routeur Express
const router = express.Router();

// Récupère la configuration d'authentification JsonWebToken
const auth = require("../middleware/auth");

//On importe le middleware multer pour la gestion des images
const multer = require("../middleware/multer-config");

// On associe les fonctions aux différentes routes, on importe le controller
const saucesCtrl = require("../controllers/sauces");

// Route qui permet de créer "une sauce"
router.post("/", auth, multer, saucesCtrl.createSauce);

// Route qui permet de modifier "une sauce"
router.put("/:id", auth, multer, saucesCtrl.modifySauce);

// Route qui permet de supprimer une sauce avec l'ID fourni.
router.delete("/:id", auth, saucesCtrl.deleteSauce);

// Route qui permet de cliquer sur une des sauces précise
router.get("/:id", auth, saucesCtrl.getOneSauce);

// Route qui permet de récupérer toutes les sauces
router.get("/", auth, saucesCtrl.getAllSauce);

// Route qui permet de gérer les likes des sauces
router.post("/:id/like", auth, saucesCtrl.likeDislike);

module.exports = router;
