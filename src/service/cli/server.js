'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const chalk = require(`chalk`);

const DEFAULT_PORT = 3000;

const articlesRoute = require(`./routes/articles`);
const categoriesRoute = require(`./routes/categories`);
const searchRoute = require(`./routes/search`);

const createServer = () => {
  const server = express();

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({extended: false}));

  server.use(`/articles`, articlesRoute);
  server.use(`/categories`, categoriesRoute);
  server.use(`/search`, searchRoute);

  server.use((_err, _req, res, _) => {
    res
      .status(500)
      .send(`Error while creating server`);
  });

  return server;
};

const run = async (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

  if (customPort <= 0) {
    return console.log(chalk.red(`Port cannot be negative`));
  }

  const server = await createServer();

  return server
    .listen(port, () => console.log(`Start server on PORT: ${port}`));
};

module.exports = {
  name: `--server`,
  run,
  createServer,
};
