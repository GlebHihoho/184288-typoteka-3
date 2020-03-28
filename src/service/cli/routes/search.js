'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);

const searchRoute = new Router();

const FILE_NAME = `mocks.json`;

const readMocks = async () => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    return mocks;
  } catch (err) {
    return [];
  }
};

searchRoute.get(`/`, async (req, res) => {
  const offers = await readMocks();
  const {query} = req.query;

  const response = offers.filter((offer) => offer.title.indexOf(query) !== -1);
  return res.send(response);
});

module.exports = searchRoute;
