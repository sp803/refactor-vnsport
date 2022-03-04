const categoryService = require('../services/category.service');
const handleError = require('../utils/handle-error');

const getCategories = handleError(async (req, res) => {
  const { brandId, categoryGroupCode } = req.query;

  let categories = null;
  if (brandId) {
    categories = await categoryService.getCategoriesByBrandId(brandId);
  } else if (categoryGroupCode) {
    categories = await categoryService.getCategoriesByCategoryGroupCode(
      categoryGroupCode
    );
  } else {
    categories = await categoryService.getCategories();
  }
  res.json(categories);
});

const getCategoryGroups = handleError(async (req, res) => {
  res.json(await categoryService.getCategoryGroups());
});

module.exports = {
  getCategories,
  getCategoryGroups,
};
