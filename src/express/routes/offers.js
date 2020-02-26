'use strict';

const {Router} = require(`express`);

const offersRoute = new Router();

offersRoute.get(`/`, (req, res) => res.send(`/offers`));
offersRoute.get(`/:id`, (req, res) => res.send(`/offers/${req.params.id}`));
offersRoute.get(`/add`, (req, res) => res.send(`/offers/add`));
offersRoute.get(`/edit/:id`, (req, res) => res.send(`/offers/edit/${req.params.id}`));
offersRoute.get(`/category/:id`, (req, res) => res.send(`/offers/category/${req.params.id}`));

module.exports = offersRoute;
