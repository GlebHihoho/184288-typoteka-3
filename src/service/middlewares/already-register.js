'use strict';

const {HTTP_CODE} = require(`../../constants`);

module.exports = (userService) => async (req, res, next) => {
  try {
    const {body} = req;
    const userExist = await userService.findByEmail(body.email);

    if (userExist) {
      return res
        .status(HTTP_CODE.BAD_REQUEST)
        .json({
          message: [`"exist" Пользователь с таким email уже зарегистрирован`],
          data: {}
        });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
