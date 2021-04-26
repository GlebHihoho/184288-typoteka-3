'use strict';

const {Router} = require(`express`);

const {HTTP_CODE} = require(`../../constants`);
const route = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {

    if (!req.query.search) {
      return res.status(HTTP_CODE.BAD_REQUEST).json([]);
    }

    const result = await searchService.findAll(req.query.search);

    return res.send(result);
  });
};
