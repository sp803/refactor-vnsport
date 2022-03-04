const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const categoryService = require('./category.service');

const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');

const getBrands = () => {
  return Brand.findAll();
};

const getBrandsByCategoryCode = async (categoryCode) => {
  const category = await Category.findOneByCode(categoryCode, {
    include: Brand,
  });
  if (!category)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category code not exists');

  return category.brands;
};

const getBrandsByCategoryGroupCode = async (categoryGroupCode) => {
  const categories = await categoryService.getCategoriesByCategoryGroupCode(
    categoryGroupCode
  );
  const [...brands] = await Promise.all(
    categories.map((category) => category.getBrands())
  );
  const data = {};
  brands.flat().forEach((brand) => {
    if (!data[brand.id]) {
      data[brand.id] = brand;
    }
  });

  return Object.values(data);
};

module.exports = {
  getBrands,
  getBrandsByCategoryCode,
  getBrandsByCategoryGroupCode,
};
