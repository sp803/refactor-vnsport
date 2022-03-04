const User = require('../models/user.model');
const Joi = require('joi');

const signup = {
  body: Joi.object({
    name: Joi.string().min(1).max(254).required(),
    dob: Joi.date().max('now').required(),
    gender: Joi.string()
      .equal(...Object.values(User.gender))
      .required(),
    email: Joi.string().trim().lowercase().email().max(254).required(),
    password: Joi.string().min(4).max(200).required(),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().max(254).required(),
    password: Joi.string().min(4).max(200).required(),
  }),
};

const findUser = {
  params: Joi.object({
    userId: Joi.string().required(),
  }),
};

module.exports = {
  signup,
  login,
  findUser,
};
