'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);

const {HTTP_CODE} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

const articlesRoute = require(`./routes/articles`);
const categoriesRoute = require(`./routes/categories`);
const searchRoute = require(`./routes/search`);

const DEFAULT_PORT = 3000;

const logger = getLogger({name: `api`});

const createServer = () => {
  const server = express();

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({extended: false}));

  server.use(`/articles`, articlesRoute);
  server.use(`/categories`, categoriesRoute);
  server.use(`/search`, searchRoute);

  server.use((req, res) => {
    res.status(HTTP_CODE.NOT_FOUND).send(`Not found`);
    logger.error(`Route not found: ${req.url}`);
  });

  server.use((err, _req, _res, _next) => {
    logger.error(`An error occured on processing request: ${err.message}`);
  });

  server.use((req, res, next) => {
    logger.debug(`Request on route ${req.url}`);
    res.on(`finish`, () => logger.info(`Response status code ${res.statusCode}`));
    next();
  });

  server.use((_err, _req, res, _) => {
    res
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .send(`Error while creating server`);
  });

  return server;
};

const run = async (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

  if (customPort <= 0) {
    return logger.error(`Port cannot be negative`);
  }

  const server = await createServer();

  return server
    .listen(port, () => logger.info(`Start server on PORT: ${port}`))
    .on(`error`, (error) => logger.error(`Server can't start. Error: ${error}`));
};

module.exports = {
  name: `--server`,
  run,
  createServer,
};
