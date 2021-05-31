'use strict';

const {HTTP_CODE} = require(`../../constants`);

module.exports = (key, schema) => (
  async (req, res, next) => {
    try {
      await schema.validateAsync(req[key], {abortEarly: false});
      return next();
    } catch (error) {
      const {details = []} = error;

      return res
        .status(HTTP_CODE.BAD_REQUEST)
        .json({
          message: details.map((errorText) => errorText.message),
          data: req[key]
        });
    }
  }
);
