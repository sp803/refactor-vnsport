const Joi = require('joi');
const OrderGroup = require('../models/order-group.model');

const createOrder = {
  body: Joi.object({
    address: Joi.string().min(1).required(),
    phoneNumber: Joi.string().min(10).required(),
    note: Joi.string(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    ),
  }),
};

const updateOrderGroupContact = {
  body: Joi.object({
    address: Joi.string().min(1).required(),
    phoneNumber: Joi.string().min(10).required(),
  }),
};

const updateOrderGroupState = {
  body: Joi.object({
    state: Joi.string().equal(Object.values(OrderGroup.state)).required(),
    reason: Joi.string().when('state', {
      is: OrderGroup.state.canceled,
      then: Joi.string().required(),
    }),
  }).with(''),
};

const getOrderGroup = {
  query: Joi.object({
    state: Joi.string().equal(Object.values(OrderGroup.state)),
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }),
};

module.exports = {
  createOrder,
  updateOrderGroupContact,
  updateOrderGroupState,
  getOrderGroup,
};
