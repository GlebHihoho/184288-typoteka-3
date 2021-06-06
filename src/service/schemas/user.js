'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  email: Joi
    .string()
    .email()
    .required(),
  firstName: Joi
    .string()
    .required(),
  lastName: Joi
    .string()
    .required(),
  password: Joi
    .string()
    .min(6)
    .required(),
  repeatPassword: Joi
    .string()
    .min(6)
    .valid(Joi.ref(`password`))
    .required(),
  avatar: Joi
    .string()
    .allow(null, ``),
});
