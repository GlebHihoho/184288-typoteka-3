'use strict';

const {Router} = require(`express`);

const {joiValidator} = require(`../middlewares`);
const {commentSchema} = require(`../schemas`);

const route = new Router();

module.exports = (app, commentService) => {
  app.use(`/comments`, route);

  route.post(`/:articleId/create`, joiValidator(`body`, commentSchema), async (req, res, next) => {
    const {articleId} = req.params;
    try {
      await commentService.create(articleId, req.body);

      return res.send();
    } catch (error) {
      return next(error);
    }
  });

  route.get(`/last`, async (_req, res) => {
    try {
      const comments = await commentService.findLastComments();
      return res.send(comments);
    } catch (e) {
      return res.send();
    }
  });

  route.get(`/all`, async (_req, res) => {
    try {
      const comments = await commentService.findAll();
      return res.send(comments);
    } catch (e) {
      return res.send();
    }
  });

  route.delete(`/:commentId`, async (req, res) => {
    const id = req.params.commentId;
    try {
      const comments = await commentService.drop(id);
      return res.send(comments);
    } catch (e) {
      return res.send();
    }
  });
};
