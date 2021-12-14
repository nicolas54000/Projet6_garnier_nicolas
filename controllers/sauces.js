// Récupération du modèle 'sauce'
const Sauce = require("../models/sauce");

// Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images
const fs = require("fs");

// Permet de créer une nouvelle sauce

exports.createSauce = (req, res, next) => {
    // On stocke les données envoyées par le front-end =>  objet js
    const sauceObject = JSON.parse(req.body.sauce);
    // On supprime l'id généré automatiquement et envoyé par le front-end.
    // L'id de la sauce est créé par la base MongoDB
    delete sauceObject._id;
    // Création d'une instance du modèle Sauce
    const sauce = new Sauce({
        ...sauceObject,
        // On modifie l'URL de l'image et ou ajoute valeur pas defaut au chanps vides
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    // Sauvegarde de la sauce dans la base de données
    sauce
        .save()
        // On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
        .then(() =>
            res.status(201).json({
                message: "Sauce enregistrée !",
            })
        )
        // On ajoute un code erreur en cas de problème
        .catch((error) =>
            res.status(400).json({
                error,
            })
        );
};

// Permet de modifier une sauce

exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    if (req.file) {
        // Si la modification contient une image .
        Sauce.findOne({
            _id: req.params.id,
        }).then((sauce) => {
            // On supprime l'ancienne image du serveur
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlinkSync(`images/${filename}`);
        }),
            (sauceObject = {
                // On modifie les données et on ajoute la nouvelle image
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${
                    req.file.filename
                }`,
            });
    } else {
        // Si la modification ne contient pas de nouvelle image
        sauceObject = {
            ...req.body,
        };
    }
    Sauce.updateOne(
        // On applique les paramètres de sauceObject
        {
            _id: req.params.id,
        },
        {
            ...sauceObject,
            _id: req.params.id,
        }
    )
        .then(() =>
            res.status(200).json({
                message: "Sauce modifiée !",
            })
        )
        .catch((error) =>
            res.status(400).json({
                error,
            })
        );
};

// Permet de supprimer la sauce

exports.deleteSauce = (req, res, next) => {
    // on va chercher l'url de l'image et supprimer le fichier image
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {
            // on récupère l'url de la sauce
            const filename = sauce.imageUrl.split("/images/")[1];
            // on appelle unlink pour supprimer le fichier
            fs.unlink(`images/${filename}`, () => {
                // On supprime le document
                Sauce.deleteOne({
                    _id: req.params.id,
                })
                    .then(() =>
                        res.status(200).json({
                            message: "Sauce supprimée !",
                        })
                    )
                    .catch((error) =>
                        res.status(400).json({
                            error,
                        })
                    );
            });
        })
        .catch((error) =>
            res.status(500).json({
                error,
            })
        );
};

// Permet de récupérer une seule sauce, identifiée par son id

exports.getOneSauce = (req, res, next) => {
    //  l'id de la sauce
    Sauce.findOne({
        _id: req.params.id,
    })
        // Si ok on retourne une réponse et l'objet
        .then((sauce) => res.status(200).json(sauce))
        // Si erreur : erreur 404
        .catch((error) =>
            res.status(404).json({
                error,
            })
        );
};

// Permet de récuperer toutes les sauces de la base MongoDB

exports.getAllSauce = (req, res, next) => {
    // recherche la liste des sauces trouvées
    Sauce.find()
        // Si OK on retourne un tableau de toutes les données
        .then((sauces) => res.status(200).json(sauces))
        // Si erreur on retourne un message d'erreur
        .catch((error) =>
            res.status(400).json({
                error,
            })
        );
};

// on aime ou on aime pas une sauce
// like
// 1= j'aime
//-1 j'aime pas
// 0 annulation

exports.likeDislike = (req, res, next) => {
    // Like présent dans le body
    let like = req.body.like;
    // On prend le userID
    let userId = req.body.userId;
    // On prend l'id de la sauce
    let sauceId = req.params.id;
    // **ng
    console.log(req.body.like);
    // Si like
    if (like === 1) {
        Sauce.updateOne(
            {
                _id: sauceId,
            },
            {
                // On push l'utilisateur et on incrémente le compteur de 1
                $push: {
                    usersLiked: userId,
                },
                $inc: {
                    likes: 1,
                },
            }
        )
            .then(() =>
                res.status(200).json({
                    message: "j'aime ajouté !",
                })
            )
            .catch((error) =>
                res.status(400).json({
                    error,
                })
            );
    }
    // S'il s'agit d'un dislike
    if (like === -1) {
        Sauce.updateOne(
            {
                _id: sauceId,
            },
            {
                $push: {
                    usersDisliked: userId,
                },
                $inc: {
                    dislikes: 1,
                },
            }
        )
            .then(() => {
                res.status(200).json({
                    message: "Dislike ajouté !",
                });
            })
            .catch((error) =>
                res.status(400).json({
                    error,
                })
            );
    }
    // annulation un like
    if (like === 0) {
        Sauce.findOne({
            _id: sauceId,
        })
            .then((sauce) => {
                // annulation d'un like
                // on regarde dans le tableau si l'utilisateur a deja fait un like
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        {
                            _id: sauceId,
                        },
                        {
                            // $ pull on supprime id utilisateur du tableau usersliked
                            $pull: {
                                usersLiked: userId,
                            },
                            // $inc decremante la variable likes
                            $inc: {
                                likes: -1,
                            },
                        }
                    )
                        .then(() =>
                            res.status(200).json({
                                message: "Like retiré !",
                            })
                        )
                        .catch((error) =>
                            res.status(400).json({
                                error,
                            })
                        );
                }

                //  annuler un dislike
                // on regarde dans le tableau si l'utilisateur a deja fait un dislike
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        {
                            _id: sauceId,
                        },
                        {
                            // $ pull on supprime l'utilisateur du tableau usersDisliked
                            $pull: {
                                usersDisliked: userId,
                            },
                            // $inc decremante la variable deslikes
                            $inc: {
                                dislikes: -1,
                            },
                        }
                    )
                        .then(() =>
                            res.status(200).json({
                                message: "Dislike retiré !",
                            })
                        )
                        .catch((error) =>
                            res.status(400).json({
                                error,
                            })
                        );
                }
            })
            .catch((error) =>
                res.status(404).json({
                    error,
                })
            );
    }
};
