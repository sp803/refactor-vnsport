const Joi = require('joi');
const Product = require('../models/product.model');

const getProducts = {
  query: Joi.object({
    sortBy: Joi.string().equal(...Object.keys(Product.sortOptions)),
    page: Joi.number().min(1),
    limit: Joi.number().min(0),
    categoryGroupCode: Joi.string(),
    categoryCode: Joi.string(),
    brandId: Joi.alternatives(Joi.string(), Joi.number()),
  })
    .without('categoryGroupCode', 'categoryCode')
    .with('page', 'limit'),
};

const getProductDetail = {
  params: Joi.object({
    productId: Joi.alternatives(
      Joi.string().required(),
      Joi.number().required()
    ),
  }),
};

module.exports = {
  getProducts,
  getProductDetail,
};
