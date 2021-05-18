'use strict';

const {Router} = require(`express`);

const route = new Router();

module.exports = (app, commentService) => {
  app.use(`/comments`, route);

  route.get(`/last`, async (_req, res) => {
    try {
      const comments = await commentService.findLastComments();
      return res.send(comments);
    } catch (e) {
      return res.send();
    }
  });
};