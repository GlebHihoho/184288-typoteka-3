'use strict';

const Sequelize = require(`sequelize`);

const Alias = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
    this._Comment = sequelize.models.Comment;
  }

  async create(newArticle) {
    const article = await this._Article.create(newArticle);
    await article.addCategories(newArticle.categories);

    return article.get();
  }

  findAll({limit = 8, offset = 0}) {
    return this._Article.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES, Alias.COMMENTS],
      distinct: true,
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
