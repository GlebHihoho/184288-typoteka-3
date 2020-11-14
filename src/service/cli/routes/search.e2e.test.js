'use strict';

const request = require(`supertest`);

const serverApi = require(`../server`);
const {initializeMockData, clearMockData} = require(`../../../utils/prepareMockData`);
const {HTTP_CODE} = require(`../../../constants`);

let server;

beforeAll(async () => {
  server = await serverApi.createServer();
  initializeMockData();
});

afterAll(() => {
  clearMockData();
});

describe(`Search API end-points`, () => {
  test(`When get offers status code should be 200`, async () => {
    const res = await request(server).get(`/search`).query({query: `Асинхронность`});
    expect(res.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`1 offer found`, async () => {
    const res = await request(server).get(`/search`).query({query: `Асинхронность`});
    expect(res.body.length).toBe(1);
  });

  test(`Offer has correct id`, async () => {
    const res = await request(server).get(`/search`).query({query: `Асинхронность`});
    expect(res.body[0].id).toBe(`DqYYpe`);
  });

  test(`API returns empty array if nothing is found`, async () => {
    const res = await request(server).get(`/search`).query({query: `Куплю слона`});
    expect(res.body.length).toBe(0);
  });
});
