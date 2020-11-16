'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const {getLogger} = require(`../../lib/logger`);

const categoriesRoute = new Router();
const logger = getLogger();

const FILE_NAME = `data/categories.txt`;

const readMocks = async () => {
  try {
    const fileContent = await fs.readFile(FILE_NAME, `utf8`);
    const mocks = fileContent.split(`\n`);
    return mocks;
  } catch (err) {
    logger.error(`Error occurs: ${err}`);
    return [];
  }
};

categoriesRoute.get(`/`, async (req, res) => {
  const categories = await readMocks();
  logger.debug(`${req.method} ${req.originalUrl} -- res status code ${res.statusCode}`);
  return res.send(categories);
});

module.exports = categoriesRoute;
