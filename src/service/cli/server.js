'use strict';

const express = require(`express`);
const {Router} = require(`express`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const routes = new Router();

routes.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.send(mocks);
  } catch (err) {
    res.send([]);
  }
});

module.exports = {
  name: `--server`,
  run: (args) => {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    if (customPort <= 0) {
      return console.log(chalk.red(`Порт не может быть отрицательным`));
    }

    const app = express();

    app.use(`/posts`, routes);
    app.use((err, req, res, _) => {
      res
        .status(500)
        .send(`Ошибка при создании сервера`);
    });

    return app
      .listen(port, () => console.log(`Сервер запущен на порту: ${port}`));
  },
};
