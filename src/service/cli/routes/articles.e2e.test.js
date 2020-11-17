'use strict';

const request = require(`supertest`);
const {find, map} = require(`lodash`);

const serverApi = require(`../server`);
const {initializeMockData, clearMockData, mockData} = require(`../../../utils/prepareMockData`);
const {HTTP_CODE} = require(`../../../constants`);

let server;

const articleKeys = [`id`, `title`, `announce`, `fullText`, `сategory`, `createdDate`, `comments`];
const postArticlesData = {
  "title": `Личный проект: покоритель файлов`,
  "announce": [
    `В этом разделе мы обсудим способы взаимодействия с клиентами.`,
    `Если мы вдруг захотим разнообразить моки, то сможем обойтись без правок сценария.`,
    `В этом разделе мы начнём проектировать API.`,
    `В этом разделе мы поговорим о тестировании приложений на node.js.`,
    `Это один из лучших рок-музыкантов.`
  ],
  "fullText": [
    `В этом разделе мы обсудим способы взаимодействия с клиентами.`,
    `Если мы вдруг захотим разнообразить моки, то сможем обойтись без правок сценария.`,
    `В этом разделе мы начнём проектировать API.`,
    `В этом разделе мы поговорим о тестировании приложений на node.js.`,
    `Это один из лучших рок-музыкантов.`,
    `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    `В последнем модуле мы разберем вопросы, связанные с доставкой приложения на сервер и запуску в боевой среде.`,
    `В корне проекта создайте директорию data.`
  ],
  "сategory": [
    `Музыка`,
    `Воздух`,
    `Металл`,
    `Без рамки`,
    `За жизнь`,
    `Деревья`,
    `Node`,
    `Разное`
  ],
  "createdDate": `2020-10-3 12:17:14`,
  "comments": [
    {
      "id": `a9oBrv`,
      "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
    },
    {
      "id": `d5OBsN`,
      "text": `Плюсую, но слишком много буквы!`
    }
  ]
};
const putArticlesData = {
  ...postArticlesData,
  "title": `Новый заголовок`
};


beforeAll(async () => {
  server = await serverApi.createServer();
  initializeMockData();
});

afterAll(() => {
  clearMockData();
});

describe(`Articles API end-points`, () => {
  test(`When get articles status code should be 200`, async () => {
    const res = await request(server).get(`/articles`);
    expect(res.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`When get article by ID data should be equal mockData`, async () => {
    const id = `DqYYpe`;
    const res = await request(server).get(`/articles/${id}`);
    articleKeys.forEach((key) => expect(res.body).toHaveProperty(key));
    const article = find(mockData, [`id`, id]);
    expect(res.body).toEqual(article);
  });

  let articleId;

  test(`When POST article request was Success. Amount should be +1`, async () => {
    const res = await request(server).get(`/articles`);
    const initAmount = res.body.length;
    const postArticleRes = await request(server).post(`/articles`).send(postArticlesData);
    articleId = postArticleRes.body.id;
    const newRes = await request(server).get(`/articles`);
    const createdArticleRes = await request(server).get(`/articles/${articleId}`);
    const newAmount = newRes.body.length;
    expect(newAmount).toBe(initAmount + 1);
    expect(createdArticleRes.body).toEqual({...postArticlesData, id: articleId});
  });

  test(`GET. Check get article by ID`, async () => {
    const res = await request(server).get(`/articles/${articleId}`);
    expect(res.body).toEqual({...postArticlesData, id: articleId});
  });

  test(`PUT. Check that article was changed`, async () => {
    const putData = {...putArticlesData, id: articleId};
    const res = await request(server).put(`/articles/${articleId}`).send(putData);
    expect(res.statusCode).toBe(HTTP_CODE.OK);
    const getRes = await request(server).get(`/articles/${articleId}`);
    expect(getRes.body).toEqual(putData);
  });

  test(`DELETE. Check that article was removed`, async () => {
    const deleteRes = await request(server).delete(`/articles/${articleId}`);
    expect(deleteRes.statusCode).toBe(HTTP_CODE.OK);
    const getRes = await request(server).get(`/articles/${articleId}`);
    expect(getRes.statusCode).toBe(HTTP_CODE.NOT_FOUND);
  });

  test(`DELETE. Check that article was not removed because ID hadn't been founded`, async () => {
    const deleteRes = await request(server).delete(`/articles/112233`);
    expect(deleteRes.statusCode).toBe(HTTP_CODE.NOT_FOUND);
  });

  test(`GET. Check comments by article ID`, async () => {
    const res = await request(server).get(`/articles/DqYYpe/comments`);
    expect(res.statusCode).toBe(HTTP_CODE.OK);
    const {comments} = find(mockData, [`id`, `DqYYpe`]);
    expect(res.body).toEqual(comments);
  });

  test(`GET. Check that comments by article ID not found`, async () => {
    const res = await request(server).get(`/articles/112233/comments`);
    expect(res.statusCode).toBe(HTTP_CODE.NOT_FOUND);
  });

  test(`DELETE. Check that comment was removed by ID`, async () => {
    const commentId = `p9zkKq`;
    const initCommentsRes = await request(server).get(`/articles/wo_O42/comments`);
    const deleteRes = await request(server).delete(`/articles/wo_O42/comments/${commentId}`);
    expect(deleteRes.statusCode).toBe(HTTP_CODE.OK);
    const updateCommentsRes = await request(server).get(`/articles/wo_O42/comments`);
    expect(initCommentsRes.body.length).toBe(updateCommentsRes.body.length + 1);
    const commentIds = map(updateCommentsRes.body, `id`);
    expect(commentIds).not.toContain(commentId);
  });

  test(`POST. Check that comment was created`, async () => {
    const postRes = await request(server).post(`/articles/wo_O42/comments`).send({text: `Test comment`});
    expect(postRes.statusCode).toBe(200);
    const res = await request(server).get(`/articles/wo_O42/comments`);
    expect(res.statusCode).toBe(200);
    const {text} = res.body.filter((item) => item.text === `Test comment`)[0];
    expect(text).toEqual(`Test comment`);
  });
});
