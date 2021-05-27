'use strict';

const Alias = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  create(articleId, data) {
    return this._Comment.create({
      articleId,
      ...data
    });
  }

  async findByArticleId(articleId) {
    const comments = await this._Comment.findAll({
      where: {
        articleId
      },
      include: [Alias.USER],
      row: true
    });

    return comments.map((comment) => comment.get());
  }

  async findAll() {
    const comments = await this._Comment.findAll({
      order: [[`createdAt`, `DESC`]],
      include: [Alias.USER, Alias.ARTICLES],
      row: true
    });

    return comments.map((comment) => comment.get());
  }

  async findLastComments() {
    const comments = await this._Comment.findAll({
      limit: 4,
      subQuery: false,
      order: [[`createdAt`, `DESC`]],
      include: [Alias.USER],
      row: true
    });

    return comments.map((comment) => comment.get());
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CommentService;
