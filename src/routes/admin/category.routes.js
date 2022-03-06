const routes = require('express').Router();
const categoryValidation = require('../../validations/category.validation');
const validate = require('../../middlewares/validate');
const categoryController = require('../../controllers/category.controller');

routes.post(
  '/',
  validate(categoryValidation.addCategory),
  categoryController.addCategory
);
routes
  .route('/:categoryId')
  .put(
    validate(categoryValidation.addCategory),
    categoryController.updateCategory
  )
  .delete(categoryController.deleteCategory);

routes.post(
  '/groups',
  validate(categoryValidation.addCategoryGroup),
  categoryController.addCategoryGroup
);
routes
  .route('/groups/:categoryGroupId')
  .put(
    validate(categoryValidation.addCategoryGroup),
    categoryController.updateCategoryGroup
  )
  .delete(categoryController.deleteCategoryGroup);

module.exports = routes;
