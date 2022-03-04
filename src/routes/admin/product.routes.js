const routes = require('express').Router();
const productController = require('../../controllers/product.controller');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');

routes.post(
  '/',
  validate(productValidation.addProduct),
  productController.addProduct
);

module.exports = routes;
