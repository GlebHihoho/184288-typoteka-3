'use strict';

const express = require(`express`);
const helmet = require(`helmet`);

const {getLogger} = require(`./lib/logger`);
const routes = require(`./api`);
const {API_PREFIX, HTTP_CODE} = require(`../constants`);

const logger = getLogger({name: `api`});
const app = express();

app.use(express.json());
app.use(API_PREFIX, routes);
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: [`'self'`],
    scriptSrc: [`'self'`],
  }
}));

app.use((req, res) => {
  res.status(HTTP_CODE.NOT_FOUND).send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => logger.info(`Response status code ${res.statusCode}`));
  next();
});

app.use((_err, _req, res, _) => {
  res
    .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
    .send(`Error while creating server`);
});

module.exports = app;
