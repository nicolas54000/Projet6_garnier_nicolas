
// Appel du plugin mongoose-validator pour verifier la syntaxe

const validate = require('mongoose-validator');

// verification nom de la sauce
//  entre 3 et 60 caractères et pas de synboles

exports.nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 60],
    message: 'Le nom de votre Sauce doit contenir entre 3 and 60 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i,
    message: "les symboles ne sont pas autorisés",
  }),
];
// Validation pour le manufacturer
// entre 3 et 40 caractères et pas de synboles

exports.manufacturerValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 40],
    message: 'Le nom du fabricant doit contenir entre 3 et 40 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i,
    message: "les symboles ne sont pas autorisés",
  }),
];

//  Validation pour la decription de la sauce
// entre 10 et 150 caractères et pas de synboles


exports.descriptionValidator = [
  validate({
    validator: 'isLength',
    arguments: [10, 150],
    message: 'La description de la sauce doit contenir entre 10 et 150 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i,
    message: "les symboles ne sont pas autorisés",
  }),
];

// Validation pour ingrédient de la sauce
// entre 3 et 20 caractères et pas de synboles


exports.pepperValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'Le principal ingrédient doit contenir entre 3 et 20 caractères',
  }),

  // Ne peut contenir que des caractères alphanumériques
  validate({
    validator: 'isAlphanumeric',
    message: "les symboles ne sont pas autorisés",
  }),
];
