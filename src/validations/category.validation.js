const Joi = require('joi');

const getCategories = {
  query: Joi.object({
    brandId: Joi.alternatives(Joi.string(), Joi.number()),
    categoryGroupCode: Joi.string(),
  }).without('brandId', 'categoryGroupCode'),
};

module.exports = {
  getCategories,
};
