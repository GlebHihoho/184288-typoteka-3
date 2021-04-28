'use strict';

const Alias = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
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

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CommentService;
