'use strict';

const Alias = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
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

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = ArticleService;
