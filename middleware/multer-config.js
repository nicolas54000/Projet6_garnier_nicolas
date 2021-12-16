const multer = require("multer");
var path = require('path')


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        // correction pb avec le nom, il garde son extension
        const ext = path.extname(name);
        // on supprime l'extension
        const nomsansext = name.replace( ext, "");
        //console.log(nomsansext);

        // const extension = MIME_TYPES[file.mimetype];
        callback(null, nomsansext + Date.now() +  ext);
    },
});

module.exports = multer({ storage: storage }).single("image");
