'use strict';

const {Router} = require(`express`);

const registerRoute = new Router();

registerRoute.get(`/`, (req, res) => res.send(`/register`));

module.exports = registerRoute;
