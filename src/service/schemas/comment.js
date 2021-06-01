'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  articleId: Joi
    .number()
    .integer()
    .positive()
    .required(),
  userId: Joi
    .number()
    .integer()
    .positive()
    .required(),
  text: Joi
    .string()
    .min(20)
    .required()
});
