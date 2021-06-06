'use strict';

const {Router} = require(`express`);
const dayjs = require(`dayjs`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);
dayjs.extend(customParseFormat);

const {getErrorMessage, getImage, getCategoryArticle} = require(`../../utils`);
const {HTTP_CODE} = require(`../../constants`);
const {uploadImage} = require(`../middlewares`);
const api = require(`../api`);

const articlesRoute = new Router();

articlesRoute.get(`/add`, async (_req, res) => {
  const categories = await api.getCategories();
  const articleData = {
    categories: [],
    createdAt: dayjs().format(`DD/MM/YYYY`),
  };

  const pageContent = {
    title: `Новая публикация`,
    bodyStyle: `height: 1050px;`,
    divClass: `wrapper`,
    header: `search`,
    categories,
    articleData,
    errorMessage: {},
  };

  return res.render(`pages/new-post`, pageContent);
});

articlesRoute.post(`/add`, uploadImage.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    ...body,
    image: getImage(file, body),
    createdAt: dayjs(body.createdAt, `DD.MM.YYYY`).toISOString(),
    categories: getCategoryArticle(body.categories),
  };

  try {
    await api.createArticle(articleData);
    return res.redirect(`/my`);
  } catch (error) {
    const categories = await api.getCategories();

    const pageContent = {
      title: `Новая публикация`,
      bodyStyle: `height: 1050px;`,
      divClass: `wrapper`,
      header: `search`,
      categories,
      articleData,
      errorMessage: getErrorMessage(error.response.data.message),
    };

    return res.render(`pages/new-post`, pageContent);
  }
});

articlesRoute.get(`/:articleId`, async (req, res) => {
  try {
    const id = req.params.articleId;

    const {articleData, commentsData, categoriesData} = await api.getArticleById(id);

    articleData.categories = articleData.categories.map((category) => {
      const count = categoriesData.find((item) => item.id === category.id).count;
      return {...category, count};
    });

    const pageContent = {
      title: `Публикация`,
      bodyStyle: ``,
      divClass: `wrapper`,
      header: `loggedOn`,
      article: articleData,
      comments: commentsData,
      errorMessage: {},
    };

    return res.render(`pages/post`, pageContent);
  } catch (error) {
    console.log(`error`, error);
    return res.status(HTTP_CODE.NOT_FOUND).render(`pages/400`);
  }
});

articlesRoute.post(`/:articleId`, async (req, res) => {
  const {body, params} = req;
  const {articleId} = params;

  try {
    // TODO: remove userId after add login and registration
    await api.createActicleComment(articleId, {...body, articleId, userId: 1});
    return res.redirect(`/articles/${articleId}`);
  } catch (error) {
    const {articleData, commentsData, categoriesData} = await api.getArticleById(articleId);

    articleData.categories = articleData.categories.map((category) => {
      const count = categoriesData.find((item) => item.id === category.id).count;
      return {...category, count};
    });

    const pageContent = {
      title: `Публикация`,
      bodyStyle: ``,
      divClass: `wrapper`,
      header: `loggedOn`,
      article: articleData,
      comments: commentsData,
      errorMessage: getErrorMessage(error.response.data.message),
    };

    return res.render(`pages/post`, pageContent);
  }
});

articlesRoute.get(`/edit/:articleId`, async (req, res) => {
  try {
    const id = req.params.articleId;

    const {articleData} = await api.getArticleById(id);
    const categoriesData = await api.getCategories();

    const pageContent = {
      title: `Публикация`,
      bodyStyle: ``,
      divClass: `wrapper`,
      header: `loggedOn`,
      article: {
        ...articleData,
        categories: articleData.categories.map((item) => item.id),
      },
      categories: categoriesData,
      errorMessage: {}
    };

    return res.render(`pages/edit-post`, pageContent);
  } catch (error) {
    return res.status(HTTP_CODE.NOT_FOUND).render(`pages/400`);
  }
});

articlesRoute.post(`/edit/:articleId`, uploadImage.single(`picture`), async (req, res) => {
  const id = req.params.articleId;
  const {body, file} = req;

  const article = {
    ...body,
    image: getImage(file, body),
    createdAt: dayjs(body.createdAt, `DD.MM.YYYY`).toISOString(),
    categories: getCategoryArticle(body.categories),
  };

  try {
    await api.updateArticle(id, article);
    return res.redirect(`/my`);
  } catch (error) {
    const categories = await api.getCategories();

    const pageContent = {
      title: `Публикация`,
      bodyStyle: ``,
      divClass: `wrapper`,
      header: `loggedOn`,
      article,
      categories,
      errorMessage: getErrorMessage(error.response.data.message),
    };

    return res.render(`pages/edit-post`, pageContent);
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
