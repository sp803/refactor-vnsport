const Category = require('../models/category.model');
const CategoryGroup = require('../models/category-group.model');
const Brand = require('../models/brand.model');
const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');

const getCategories = () => {
  return Category.findAll();
};

const getCategoriesByCategoryGroupCode = async (categoryGroupCode) => {
  const categoryGroup = await CategoryGroup.findOne({
    where: { code: categoryGroupCode },
    include: Category,
  });
  if (!categoryGroup)
    throw new ApiError(httpStatus.NOT_FOUND, 'category group code not found');
  return categoryGroup.categories;
};

const getCategoriesByBrandId = async (brandId) => {
  const brand = await Brand.findByPk(brandId, { include: Category });
  if (!brand) throw new ApiError(httpStatus.NOT_FOUND, 'Brand id not exists');
  return brand.categories;
};

const getCategoryGroups = () => CategoryGroup.findAll();

module.exports = {
  getCategories,
  getCategoriesByCategoryGroupCode,
  getCategoriesByBrandId,
  getCategoryGroups,
};
