'use strict';

const {Router} = require(`express`);

const route = new Router();

module.exports = (app, categoryService) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const categories = await categoryService.findAll();

    return res.send(categories);
  });

  route.post(`/`, async (req, res) => {
    const category = await categoryService.create(req.body);

    return res.send(category);
  });

  route.patch(`/:categoryId`, async (req, res) => {
    const id = req.params.categoryId;
    const category = await categoryService.update(id, req.body);

    return res.send(category);
  });

  route.delete(`/:categoryId`, async (req, res) => {
    const id = req.params.categoryId;
    const category = await categoryService.drop(id);

    return res.send(category);
  });
};
