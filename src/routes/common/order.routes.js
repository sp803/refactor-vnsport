const routes = require('express').Router();
const orderController = require('../../controllers/order.controller');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');



routes.post(
  '/',
  validate(orderValidation.createOrder),
  orderController.createOrder
);

routes.put(
  '/contact',
  validate(orderValidation.updateOrderGroupContact),
  orderController.updateOrderGroupContactDetail
);

routes.put(
  '/state',
  validate(orderValidation.updateOrderGroupState),
  orderController.updateOrderGroupState
);

routes.get(
  '/',
  validate(orderValidation.getOrderGroup),
  orderController.getOrderGroupsByUser
);

module.exports = routes;
