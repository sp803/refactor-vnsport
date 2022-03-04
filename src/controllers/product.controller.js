const productService = require('../services/product.service');
const handleError = require('../utils/handle-error');

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

module.exports = {
  getProducts,
  getProduct,
};
