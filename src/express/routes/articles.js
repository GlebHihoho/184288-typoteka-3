'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

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
  console.log(`articleData`, body);
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
    const {articleData, commentsData} = await api.getArticleById(id);
    article = articleData;
    comments = commentsData;
  } catch (error) {
    return res.render(`pages/post`, pageContent);
  }

  console.log(`article`, article);
  return res.render(`pages/post`, {...pageContent, article, comments});
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
