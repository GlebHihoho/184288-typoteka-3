'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);

const categoriesRoute = new Router();

const FILE_NAME = `data/categories.txt`;

const readMocks = async () => {
  try {
    const fileContent = await fs.readFile(FILE_NAME, `utf8`);
    const mocks = fileContent.split(`\n`);
    return mocks;
  } catch (err) {
    return [];
  }
};

categoriesRoute.get(`/`, async (req, res) => {
  const categories = await readMocks();

  return res.send(categories);
});

module.exports = categoriesRoute;
