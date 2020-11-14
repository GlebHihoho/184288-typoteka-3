'use strict';

const fs = require(`fs`).promises;
const mockData = require(`../../mockData`);

const FILE_NAME = `mocks.json`;
const CATEGORIES_FILE_NAME = `data/categories.txt`;

const initializeMockData = async () => {
  try {
    await fs.writeFile(FILE_NAME, JSON.stringify(mockData, null, `  `));
  } catch (error) {
    console.error(error);
  }
};

const clearMockData = async () => {
  try {
    await fs.writeFile(FILE_NAME, JSON.stringify([], null, `  `));
  } catch (error) {
    console.error(error);
  }
};

const getCategories = async () => {
  try {
    const fileContent = await fs.readFile(CATEGORIES_FILE_NAME, `utf8`);
    return fileContent.split(`\n`);
  } catch (error) {
    console.error(error);
    return [];
  }
};

module.exports = {
  initializeMockData,
  clearMockData,
  getCategories,
  mockData,
};
