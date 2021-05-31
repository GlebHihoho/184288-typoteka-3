'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi
    .string()
    .min(30)
    .max(250)
    .required(),
  preview: Joi
    .string()
    .min(30)
    .max(250)
    .required(),
  fullText: Joi
    .string()
    .allow(null, ``)
    .max(1000),
  image: Joi
    .string()
    .allow(null, ``)
    .pattern(new RegExp(`(?:jpg|png)`)),
  categories: Joi
    .array()
    .items(Joi.string())
    .min(1)
    .required(),
  createdAt: Joi
    .date()
    .required(),
});
