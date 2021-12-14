// vérifie autentification

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_CODE);
        const userId = decodedToken.userId;
        // ajout securite  on ne peut pas supprimer un objet qui na pas etre cree par nous
        req.auth = { userId };

        if (req.body.userId && req.body.userId !== userId) {
            throw "Invalid user ID";
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
};
