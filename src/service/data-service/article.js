'use strict';

const Sequelize = require(`sequelize`);

const Alias = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._User = sequelize.models.User;
    this._Comment = sequelize.models.Comment;
  }

  findAll() {
    return this._Article.findAll({
      include: [Alias.CATEGORIES, Alias.COMMENTS],
    });
  }

  findById(id) {
    return this._Article.findByPk(id, {
      include: [Alias.CATEGORIES],
    });
  }

  async findMostPopular() {
    const result = await this._Article.findAll({
      limit: 4,
      subQuery: false,
      attributes: [
        `id`,
        `preview`,
        [Sequelize.fn(`COUNT`, Sequelize.col(`"comments"."articleId"`)), `count`]
      ],
      include: [{
        model: this._Comment,
        as: Alias.COMMENTS,
        attributes: [],
      }],
      group: [Sequelize.col(`Article.id`)],
      order: [[`count`, `DESC`]],
    });

    return result.map((it) => it.get());
  }

  async findArticlesByCategoryId(id) {
    const resArticleIds = await this._ArticleCategory
      .findAll({
        limit: 8,
        subQuery: false,
        row: true,
        where: {
          '"categoryId"': id,
        },
      });

    const articleIds = resArticleIds
      .map((it) => it.get())
      .map((articleCategory) => articleCategory.articleId);

    const result = await this._Article.findAll({
      where: {
        id: articleIds
      },
      include: [Alias.CATEGORIES, Alias.COMMENTS],
    });

    return result.map((it) => it.get());
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = ArticleService;
