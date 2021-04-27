'use strict';

const Alias = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;

    console.log(sequelize.models);
  }

  async findByArticleId(articleId) {


    const comments = await this._Comment.findAll({
      where: {
        articleId
      },
      // include: [{
      //   model: this._User,
      //   as: `user`,
      // }],
      include: [Alias.USER]
    });

    return comments;
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CommentService;
