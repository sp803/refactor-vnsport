const Product = require('../models/product.model');
const Category = require('../models/category.model');
const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');
const categoryService = require('./category.service');
const Brand = require('../models/brand.model');
const ProductImage = require('../models/product-image.model');
const sequelizeConnection = require('../models/db-connection');

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
    option.order = [Product.sortOptions[sortBy]];
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

const createPreviewImageAndAddToProduct = async (
  previewImageUrls = [],
  product,
  transaction = null
) => {
  if (!previewImageUrls || previewImageUrls.length === 0) return null;

  const transactionOption = transaction ? { transaction } : {};

  const previewImages = await ProductImage.bulkCreate(
    previewImageUrls.map((url) => ({ productId: product.id, url })),
    { ...transactionOption }
  );
  return previewImages;
};

const createProduct = async ({
  title,
  detail,
  price,
  discountPrice,
  warrantyPeriodByDay,
  state,
  brandId,
  categoryId,
  mainImageUrl,
  previewImageUrls,
}) => {
  const [brand, category] = await Promise.all([
    Brand.findByPk(brandId),
    Category.findByPk(categoryId),
  ]);

  if (!brand) throw new ApiError(httpStatus.BAD_REQUEST, 'Brand id not exists');
  if (!category)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category not exists');
  if (await Product.isTitleExists(title))
    throw new ApiError(httpStatus.CONFLICT, 'Product title already taken');

  const transaction = await sequelizeConnection.transaction();
  try {
    const product = await Product.create(
      {
        title,
        detail,
        price,
        discountPrice,
        warrantyPeriodByDay,
        state,
        brandId,
        categoryId,
        mainImageUrl,
      },
      { transaction }
    );

    if (previewImageUrls?.length > 0) {
      await createPreviewImageAndAddToProduct(
        previewImageUrls,
        product,
        transaction
      );
    }
    transaction.commit();
    return product;
  } catch (e) {
    transaction.rollback();
    throw e;
  }
};

const addPreviewImagesToProductByProductId = async (
  productId,
  previewImageUrls = []
) => {
  const product = await Product.findByPk(productId);
  if (!product)
    throw new ApiError(httpStatus.NOT_FOUND, 'Product id not exists');

  await createPreviewImageAndAddToProduct(previewImageUrls, product);
};

module.exports = {
  getProductDetail,
  getProducts,
  getProductsByCategoryCode,
  getProductsByCategoryGroupCode,
  increaseProductVisitedCount,
  createProduct,
  addPreviewImagesToProductByProductId,
};
