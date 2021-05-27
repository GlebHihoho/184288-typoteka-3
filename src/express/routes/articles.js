'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);
dayjs.extend(customParseFormat);

const api = require(`../api`);

const UPLOAD_DIR = `../../../upload`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const articlesRoute = new Router();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRoute.get(`/add`, async (_req, res) => {
  const categories = await api.getCategories();

  const pageContent = {
    title: `Новая публикация`,
    bodyStyle: `height: 1050px;`,
    divClass: `wrapper`,
    header: `search`,
    categories,
  };

  return res.render(`pages/new-post`, pageContent);
});

articlesRoute.post(`/add`, upload.single(`image`), async (req, res) => {
  const {body, file} = req;
  const articleData = body;
  articleData.image = file.filename;
  articleData.createdAt = dayjs(articleData.createdAt, `DD.MM.YYYY`).toISOString();

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
  }
});

articlesRoute.get(`/:articleId`, async (req, res) => {
  const id = req.params.articleId;
  let article = null;
  let comments = null;

  const pageContent = {
    title: `Публикация`,
    bodyStyle: ``,
    divClass: `wrapper`,
    header: `loggedOn`,
  };

  try {
    const {articleData, commentsData, categoriesData} = await api.getArticleById(id);

    articleData.categories = articleData.categories.map((category) => {
      const count = categoriesData.find((item) => item.id === category.id).count;
      return {...category, count};
    });

    article = articleData;
    comments = commentsData;
  } catch (error) {
    return res.render(`pages/post`, pageContent);
  }

  return res.render(`pages/post`, {...pageContent, article, comments});
});

articlesRoute.post(`/:articleId/comments`, async (req, res) => {
  const {body, params} = req;
  const {articleId} = params;

  try {
    // TODO: remove userId after add login and registration
    await api.createActicleComment(articleId, {...body, userId: 1});
    res.redirect(`/articles/${articleId}`);
  } catch (error) {
    console.log(`error`, error);
    res.render(`pages/500`);
  }
});

articlesRoute.get(`/edit/:articleId`, async (req, res) => {
  const id = req.params.articleId;
  let article = null;
  let categories = null;

  const pageContent = {
    title: `Публикация`,
    bodyStyle: ``,
    divClass: `wrapper`,
    header: `loggedOn`,
  };

  try {
    const {articleData} = await api.getArticleById(id);
    const categoriesData = await api.getCategories();
    article = articleData;
    categories = categoriesData;
    article.categories = article.categories.map((item) => item.id);
  } catch (error) {
    return res.render(`pages/post`, pageContent);
  }

  return res.render(`pages/edit-post`, {...pageContent, article, categories});
});

articlesRoute.post(`/edit/:articleId`, upload.single(`image`), async (req, res) => {
  const id = req.params.articleId;
  const {body, file} = req;
  const articleData = body;
  articleData.createdAt = dayjs(articleData.createdAt, `DD.MM.YYYY`).toISOString();

  if (file && file.filename) {
    articleData.image = file.filename;
  }

  try {
    await api.updateArticle(id, articleData);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
  }
});

articlesRoute.get(`/category/:categoryId`, async (req, res) => {
  const categoryId = req.params.categoryId;
  let h1 = ``;

  const pageContent = {
    title: `Публикации в категории`,
    bodyStyle: ``,
    divClass: `wrapper`,
    header: `loggedOff`,
  };

  try {
    const [categoriesData, articles] = await Promise.all([
      api.getCategories(),
      api.getArticlesByCategoryId(categoryId)
    ]);

    const categories = categoriesData.map((category) => ({
      ...category,
      isActive: category.id === Number(categoryId),
    }));

    h1 = categoriesData.find((category) => category.id === Number(categoryId)).name;

    return res.render(`pages/articles-by-category`, {...pageContent, articles, categories, h1});
  } catch (error) {
    return res.render(`pages/post`, pageContent);
  }
});

module.exports = articlesRoute;
