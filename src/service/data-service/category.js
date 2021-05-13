'use strict';

const Sequelize = require(`sequelize`);

const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  create(data) {
    return this._Category.create(data);
  }

  async findAll() {
    const result = await this._Category.findAll({
      attributes: [
        `id`,
        `name`,
        [Sequelize.fn(`COUNT`, Sequelize.col(`"articles_categories"."categoryId"`)), `count`]
      ],
      group: [Sequelize.col(`Category.id`)],
      order: [[`updatedAt`, `DESC`]],
      include: [{
        model: this._ArticleCategory,
        as: Aliase.ARTICLES_CATEGORIES,
        attributes: [],
      }]
    });

    return result.map((it) => it.get());
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async update(id, data) {
    const [affectedRows] = await this._Category.update(data, {
      where: {id}
    });

    return !!affectedRows;
  }
}

module.exports = CategoryService;
