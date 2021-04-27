'use strict';

const Aliase = require(`./aliase`);
const defineArticle = require(`./article`);
const defuneArticleCategory = require(`./articleCategory`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineUser = require(`./user`);

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const ArticleCategory = defuneArticleCategory(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const User = defineUser(sequelize);

  User.hasMany(Article, {as: Aliase.ARTICLES, foreignKey: `userId`});
  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`});

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `CASCADE`, onUpdate: `CASCADE`});
  Article.belongsTo(User, {as: Article.USER, foreignKey: `userId`});
  Comment.belongsTo(Article, {as: Aliase.ARTICLES, foreignKey: `articleId`});
  Comment.belongsTo(User, {as: Aliase.USER, foreignKey: `userId`});

  Article.belongsToMany(Category, {through: ArticleCategory, foreignKey: `articleId`, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, foreignKey: `categoryId`, as: Aliase.ARTICLES});

  return {Article, ArticleCategory, Category, Comment, User};
};

module.exports = define;
