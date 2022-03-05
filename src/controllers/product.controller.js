const httpStatus = require('http-status');
const productService = require('../services/product.service');
const handleError = require('../utils/handle-error');
const imageUtils = require('../utils/image.util');

const getProducts = handleError(async (req, res) => {
  const { categoryCode, categoryGroupCode, brandId, page, limit, sortBy } =
    req.query;

  const filterOption = { brandId, page, limit, sortBy };
  let products = null;
  if (categoryCode) {
    products = await productService.getProductsByCategoryCode(
      categoryCode,
      filterOption
    );
  } else if (categoryGroupCode) {
    products = await productService.getProductsByCategoryGroupCode(
      categoryGroupCode,
      filterOption
    );
  } else {
    products = await productService.getProducts(filterOption);
  }

  return res.json(products);
});

const getProduct = handleError(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.getProductDetail(productId);
  res.json(product);
  productService.increaseProductVisitedCount(productId);
});

const addProduct = handleError(async (req, res) => {
  const {
    images,
    mainImage: [mainImage],
  } = req.files;

  req.body.mainImageUrl = imageUtils.createImageUrlFromMulterFile(mainImage);
  
  if (images?.length > 0) {
    req.body.previewImageUrls = images.map((image) =>
      imageUtils.createImageUrlFromMulterFile(image)
    );
  }

  const product = await productService.createProduct(req.body);
  res.json({ product });
});

const addPreviewImages = handleError(async (req, res) => {
  const { productId } = req.params;
  const images = req.files;
  const previewImageUrls = images.map((image) =>
    imageUtils.createImageUrlFromMulterFile(image)
  );
  await productService.addPreviewImagesToProductByProductId(
    productId,
    previewImageUrls
  );
  return res.sendStatus(httpStatus.CREATED);
});

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  addPreviewImages,
};
