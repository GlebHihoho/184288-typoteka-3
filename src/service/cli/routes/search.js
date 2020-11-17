'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const {HTTP_CODE} = require(`../../../constants`);
const {getLogger} = require(`../../lib/logger`);

const searchRoute = new Router();
const logger = getLogger();

const FILE_NAME = `mocks.json`;

const readMocks = async () => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    return mocks;
  } catch (err) {
    logger.error(`Error occurs: ${err}`);
    return [];
  }
};

searchRoute.get(`/`, async (req, res) => {
  const offers = await readMocks();
  const {query} = req.query;

  if (!query) {
    logger.error(`End request with status code ${HTTP_CODE.NOT_FOUND}`);
    return res.status(HTTP_CODE.NOT_FOUND).send(`Something went wrong`);
  }

  const response = offers.filter((offer) => offer.title.indexOf(query) !== -1);
  logger.debug(`${req.method} ${req.originalUrl} -- res status code ${res.statusCode}`);
  return res.send(response);
});

module.exports = searchRoute;
