'use strict';

const {Router} = require(`express`);

const {joiValidator} = require(`../middlewares`);
const {getLogger} = require(`../lib/logger`);
const {articleSchema} = require(`../schemas`);

const route = new Router();
const logger = getLogger();


module.exports = (app, articleService, commentService, categoryService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit} = req.query;
    try {
      const articles = await articleService.findAll({offset, limit});
      return res.send(articles);
    } catch (e) {
      return res.send();
    }
  });

  route.get(`/most-popular`, async (_req, res) => {
    try {
      const articles = await articleService.findMostPopular();
      return res.send(articles);
    } catch (e) {
      return res.send();
    }
  });

  route.get(`/category-id/:categoryId`, async (req, res) => {
    const id = req.params.categoryId;

    try {
      const articles = await articleService.findArticlesByCategoryId(id);

      return res.send(articles);
    } catch (e) {
      console.log(e);
      return res.send();
    }
  });

  route.get(`/:articleId`, async (req, res) => {
    const id = req.params.articleId;

    try {
      const [articleData, commentsData, categoriesData] = await Promise.all([
        articleService.findById(id),
        commentService.findByArticleId(id),
        categoryService.findAll(),
      ]);

      return res.send({articleData, commentsData, categoriesData});
    } catch (e) {
      console.log(e);
      return res.send();
    }
  });

  route.delete(`/:articleId`, async (req, res) => {
    const id = req.params.articleId;
    const article = await articleService.drop(id);

    logger.debug(`${req.method} ${req.originalUrl} -- res status code ${res.statusCode}`);

    return res.send(article);
  });

  route.post(`/add`, joiValidator(`body`, articleSchema), async (req, res, next) => {
    try {
      const article = await articleService.create(req.body);
      return res.send(article);
    } catch (error) {
      return next(error);
    }
  });

  route.put(`/:articleId`, joiValidator(`body`, articleSchema), async (req, res, next) => {
    const id = req.params.articleId;
    try {
      const article = await articleService.update(id, req.body);
      return res.send(article);
    } catch (error) {
      console.log(`error`, error);
      return next(error);
    }
  });
};
