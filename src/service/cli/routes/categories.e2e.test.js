'use strict';

const request = require(`supertest`);

const serverApi = require(`../server`);
const {initializeMockData, clearMockData, getCategories} = require(`../../../utils/prepareMockData`);
const {HTTP_CODE} = require(`../../../constants`);

let server;
let categories;

beforeAll(async () => {
  server = await serverApi.createServer();
  categories = await getCategories();
  initializeMockData();
});

afterAll(() => {
  clearMockData();
});

describe(`Categories API end-points`, () => {
  test(`When get categories status code should be 200`, async () => {
    const res = await request(server).get(`/categories`);
    expect(res.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`When get categories data should be equal`, async () => {
    const res = await request(server).get(`/categories`);
    expect(res.body).toEqual(categories);
  });
});
