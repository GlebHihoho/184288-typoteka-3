'use strict';

const {Router} = require(`express`);

const {HTTP_CODE} = require(`../../constants`);
const {alreadyRegister, joiValidator} = require(`../middlewares`);
const {userSchema} = require(`../schemas`);

const route = new Router();

module.exports = (app, userService) => {
  app.use(`/users`, route);

  route.post(`/`, [joiValidator(`body`, userSchema), alreadyRegister(userService)], async (req, res, next) => {
    try {
      const user = await userService.create(req.body);
      console.log(`user`, user);
      return res
        .status(HTTP_CODE.CREATED)
        .json({
          message: `A new user created`,
          data: user
        });
    } catch (error) {
      console.log(`---------------------`, error);
      return next(error);
    }
  });
};
