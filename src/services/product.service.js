const Product = require('../models/product.model');
const Category = require('../models/category.model');
const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');
const categoryService = require('./category.service');
const Brand = require('../models/brand.model');
const ProductImage = require('../models/product-image.model');

const productPreviewAttributes = [
  'id',
  'title',
  'price',
  'discountPrice',
  'state',
  'mainImageUrl',
  'soldCount',
  'visitedCount',
  'reviewCount',
];

const generateProductFilterOption = (filterOption = {}) => {
  if (Object.keys(filterOption).length === 0) return {};
  const option = {};
  const { page, limit, sortBy, brandId } = filterOption;
  if (page && limit) {
    option.offset = page * limit;
    option.limit = limit;
  }

  if (sortBy) {
    option.order = Product.sortOptions[sortBy];
  }

  if (brandId) {
    option.where = { brandId };
  }

  return option;
};

const increaseProductVisitedCount = async (productId) => {
  await Product.increment('visitedCount', { by: 1, where: { id: productId } });
};

const getProductDetail = async (productId) => {
  const product = await Product.findByPk(productId, {
    include: [Brand, Category, ProductImage],
  });

  if (!product)
    throw new ApiError(httpStatus.NOT_FOUND, 'Product id not exists');

  return product;
};

const getProducts = (filterOption = {}) => {
  const option = generateProductFilterOption(filterOption);
  option.attributes = productPreviewAttributes;
  return Product.findAndCountAll(option);
};

const getProductsByCategoryCode = async (categoryCode, filterOption = {}) => {
  const category = await Category.findOneByCode(categoryCode);
  if (!category)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Code not exists');

  const option = generateProductFilterOption(filterOption);
  option.where = option.where || {};
  option.where.categoryId = category.id;
  option.attributes = productPreviewAttributes;
  return Product.findAndCountAll(option);
};

const getProductsByCategoryGroupCode = async (
  categoryGroupCode,
  filterOption = {}
) => {
  const categories = await categoryService.getCategoriesByCategoryGroupCode(
    categoryGroupCode
  );
  const categoriesIdList = categories.map((category) => category.id);

  const option = generateProductFilterOption(filterOption);
  option.where = option.where || {};
  option.where.categoryId = categoriesIdList;
  option.attributes = productPreviewAttributes;
  return Product.findAndCountAll(option);
};

const createProduct = () => {};

module.exports = {
  getProductDetail,
  getProducts,
  getProductsByCategoryCode,
  getProductsByCategoryGroupCode,
  increaseProductVisitedCount,
  createProduct,
};
