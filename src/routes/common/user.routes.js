const routes = require('express').Router();
const cartController = require('../../controllers/cart.controller');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const authMiddleware = require('../../middlewares/authentication');
const cartValidation = require('../../validations/cart.validation');

/*------------------------------------------------------*/
/*--------------------/api/user-----------------------*/
/*------------------------------------------------------*/

/**
 * @openapi
 * tags:
 *  name: User
 *  description: User functionality
 */

/**
 *
 * @openapi
 * /api/user/signup:
 *  post:
 *    summary: Register new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - dob
 *              - gender
 *              - email
 *              - password
 *            properties:
 *              name:
 *                type: string
 *                minlength: 1
 *                maxLength: 254
 *              dob:
 *                type: string
 *                format: date
 *              gender:
 *                type: string
 *                enum: [male, female, other]
 *              email:
 *                type: string
 *                format: email
 *                maxLength: 254
 *                description: must be unique
 *              password:
 *                type: string
 *                format: password
 *                minLength: 4
 *                maxLength: 200
 *    responses:
 *      "200":
 *        description: Signup success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/User'
 *                token:
 *                  $ref: '#/components/schemas/token'
 *      "409":
 *        $ref: '#components/responses/DuplicateEmail'
 *
 *      "400":
 *        description: Invalid parameters
 */

routes.post('/signup', validate(userValidation.signup), userController.signup);

/**
 * @openapi
 * /api/user/signin:
 *  post:
 *    summary: Signin with user account
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                maxLength: 254
 *              password:
 *                type: string
 *                format: password
 *                minLength: 4
 *                maxLength: 200
 *    responses:
 *      "200":
 *        description: Signin success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/User'
 *                token:
 *                  $ref: '#/components/schemas/token'
 *      "404":
 *        description: Email not exists
 *
 *      "400":
 *        description: Wrong password
 */

routes.post('/signin', validate(userValidation.login), userController.login);

/**
 * @openapi
 * /api/user/logout-all:
 *  post:
 *    summary: Terminate all user token
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: header authorization
 *        name: token
 *        schema:
 *          type: string
 *        required: true
 *        description: authorization token
 *    responses:
 *      "200":
 *        description: Success
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 */

routes.post(
  '/logout-all',
  authMiddleware.verifyToken,
  userController.logoutAll
);

/**
 * @openapi
 * /api/user/check-token:
 *  post:
 *    summary: Check token is still valid
 *    tags: [User]
 *    parameters:
 *      - in: header authorization
 *        name: token
 *        schema:
 *          type: string
 *        required: true
 *        description: authorization token
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      "204":
 *        description: Token still good
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 */

routes.post(
  '/check-token',
  authMiddleware.verifyToken,
  userController.checkToken
);

/**
 * @openapi
 * /api/user/:
 *  get:
 *    summary: Get user detail
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: header authorization
 *        name: token
 *        schema:
 *          type: string
 *        required: true
 *        description: authorization token
 *    responses:
 *      "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/User'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 */

routes.get('/', authMiddleware.verifyToken, userController.getUserDetail);

/**
 * @openapi
 * tags: Cart
 */

/**
 * @openapi
 * /api/users/cart:
 *  get:
 *    tags: [User Cart]
 *    summary: Get user cart
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: User's cart
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                cart:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      title:
 *                        type: string
 *                      price:
 *                        type: number
 *                      discountPrice:
 *                        type: number
 *                      state:
 *                        type: string
 *                        enum: [available, outstock, hidden]
 *                      mainImageUrl:
 *                        type: string
 *                      quantity:
 *                        type: number
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *
 *  post:
 *    tags: [User Cart]
 *    summary: Add product to user cart, if that product already in user cart, this will increase the quantity
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - productId
 *            properties:
 *              productId:
 *                type: string | number
 *                description: id of product
 *              quantity:
 *                type: number
 *                description: quantity of product need to put in cart
 *    responses:
 *      201:
 *        description: Add product to cart success
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      404:
 *        description: Product id not exists
 *        $ref: '#components/responses/NotFound'
 *
 *  put:
 *    tags: [User Cart]
 *    summary: Update product quantity in cart, delete if quantity = 0
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - productId
 *              - quantity
 *            properties:
 *              productId:
 *                type: string
 *                description: id of product
 *              quantity:
 *                type: number
 *                description: quantity of product need to put in cart
 *    responses:
 *      204:
 *        description: Update product quantity success
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      404:
 *        description: Product id not exists
 *        $ref: '#components/responses/NotFound'
 */

routes.use('/cart', authMiddleware.verifyToken);
routes
  .route('/cart')
  .get(cartController.getProductsInCart)
  .post(
    validate(cartValidation.addProductToCart),
    cartController.addProductToCartOrUpdateQuantity
  )
  .put(
    validate(cartValidation.updateQuantity),
    cartController.updateProductInCartQuantity
  );

module.exports = routes;
