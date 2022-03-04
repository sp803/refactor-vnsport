const Joi = require('joi');

const getBrands = {
  query: Joi.object({
    categoryCode: Joi.string(),
    categoryGroupCode: Joi.string(),
  }).without('categoryCode', 'categoryGroupCode'),
};

module.exports = {
  getBrands,
};
