'use strict';

const express = require(`express`);
const dayjs = require(`dayjs`);
const path = require(`path`);
const bodyParser = require(`body-parser`);

const {HTTP_CODE} = require(`../constants`);

const mainRoute = require(`./routes/main`);
const registerRoute = require(`./routes/register`);
const loginRoute = require(`./routes/login`);
const myRoute = require(`./routes/my`);
const articlesRoute = require(`./routes/articles`);
const searchRoute = require(`./routes/search`);
const categoriesRoute = require(`./routes/categories`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `../../public`;
const UPLOAD_DIR = `../../upload`;

const app = express();

app.locals.dayjs = dayjs;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.join(__dirname, `templates`)));
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/`, mainRoute);
app.use(`/my`, myRoute);
app.use(`/login`, loginRoute);
app.use(`/search`, searchRoute);
app.use(`/register`, registerRoute);
app.use(`/articles`, articlesRoute);
app.use(`/categories`, categoriesRoute);

app.use((_req, res) => res.status(HTTP_CODE.BAD_REQUEST).render(`pages/400`));
app.use((_err, _req, res, _next) => res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).render(`pages/500`));

app
  .listen(DEFAULT_PORT, () => console.log(`Start server on PORT: ${DEFAULT_PORT}`));
