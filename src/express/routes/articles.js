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

articlesRoute.post(`/add`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const articleData = body;
  articleData[`picture`] = file.filename;

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
  }
});

articlesRoute.get(`/:id`, async (req, res) => {
  const id = req.params.id;
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
    console.log('comments', comments);
  } catch (error) {
    return res.render(`pages/post`, pageContent);
  }

  return res.render(`pages/post`, {...pageContent, article, comments});
});

articlesRoute.get(`/category/:id`, (req, res) => {
  const pageContent = {
    title: `Публикации в категории`,
    bodyStyle: ``,
    divClass: `wrapper`,
    header: `loggedOff`,
  };
  return res.render(`pages/articles-by-category`, pageContent);
});

module.exports = articlesRoute;
