const { body } = require('express-validator');

const objectValidation = () => {
  return [
    body('objects').isArray().notEmpty(),
    body('objects.*.name', '"name" field must be a string').exists().isString(),
    body('objects.*.amount', '"amount" field must be a number').exists().isInt(),
  ];
};

module.exports = {
  objectValidation,
};
