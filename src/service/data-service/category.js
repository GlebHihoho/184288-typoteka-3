'use strict';

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  create(data) {
    return this._Category.create(data);
  }

  findAll() {
    return this._Category.findAll({
      raw: true,
      order: [[`updatedAt`, `DESC`]],
    });
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
