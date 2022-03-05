const Category = require('../models/category.model');
const brandService = require('./brand.service');
const CategoryGroup = require('../models/category-group.model');
const Brand = require('../models/brand.model');
const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');
const CategoryBrand = require('../models/category-brand.model');

const findCategoryById = async (categoryId) => {
  const category = await Category.findByPk(categoryId);
  if (!category)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category id not exists');
  return category;
};

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

const addBrandToCategory = async (categoryId, brandId) => {
  try {
    // const [category] = await Promise.all([
    //   findCategoryById(categoryId),
    //   brandService.findBrandById(brandId),
    // ]);

    await CategoryBrand.create({ categoryId, brandId });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      await CategoryBrand.increment('productsCount', {
        by: 1,
        where: { categoryId, brandId },
      });
    } else {
      throw e;
    }
  }
};

module.exports = {
  getCategories,
  getCategoriesByCategoryGroupCode,
  getCategoriesByBrandId,
  getCategoryGroups,
  findCategoryById,
  addBrandToCategory,
};
