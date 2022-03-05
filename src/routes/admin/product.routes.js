const routes = require('express').Router();
const productController = require('../../controllers/product.controller');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const upload = require('../../middlewares/upload');

/**
 * @openapi
 * tags: Admin Product
 * description: Admin functionality with product
 */

/**
 * @openapi
 * /api/admin/products:
 *  post:
 *    tags: [Admin Product]
 *    summary: Add new product
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - title
 *              - detail
 *              - price
 *              - discountPrice
 *              - warrantyPeriodByDay
 *              - availableQuantity
 *              - state
 *              - brandId
 *              - categoryId
 *              - mainImage
 *            properties:
 *              title:
 *                type: string
 *                minLength: 4
 *                maxLength: 101
 *              detail:
 *                type: string
 *                minLength: 1
 *              price:
 *                type: number
 *                minimum: 0
 *              discountPrice:
 *                type: number
 *                minimum: 0
 *                maximum: price
 *              warrantyPeriodByDay:
 *                type: number
 *                minimum: 0
 *              availableQuantity:
 *                type: number
 *                minimum: 0
 *              state:
 *                type: string
 *                description: available value [available, outstock, hidden]
 *              brandId:
 *                type: number
 *              categoryId:
 *                type: number
 *              mainImage:
 *                type: string
 *                format: byte
 *              images:
 *                type: array
 *                items:
 *                  type: string
 *                  format: byte
 *                  description: Product's preview images
 *    responses:
 *      200:
 *        description: Created success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/Product'
 *      400:
 *        description: Invalid field
 *        content:
 *          application/json:
 *            example:
 *              error: "\"title\" is required"
 *      409:
 *        description: Title already exists
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 */
routes.post(
  '/',
  upload.handleMixedImageUpload([
    { name: 'images' },
    { name: 'mainImage', maxCount: 1 },
  ]),
  validate(productValidation.addProduct),
  productController.addProduct
);

/**
 * @openapi
 * /api/admin/products/{id}/add-image:
 *  post:
 *    tags: [Admin Product]
 *    summary: Add preview images to product
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - images
 *            properties:
 *              images:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
 *    responses:
 *      201:
 *        description: Add preview images success
 *      400:
 *        description: Invalid field
 *        content:
 *          application/json:
 *            example:
 *              error: "\"images\" is required"
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      404:
 *        $ref: '#components/responses/NotFound'
 */
routes.post(
  '/:productId/add-image',
  upload.handleImagesUpload('images'),
  validate(productValidation.addPreviewImages),
  productController.addPreviewImages
);

module.exports = routes;
