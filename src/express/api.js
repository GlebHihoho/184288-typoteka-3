'use strict';

const axios = require(`axios`);

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const getCategories = () => axios.get(`${defaultUrl}categories`).then((res) => res.data);
const getArticles = () => axios.get(`${defaultUrl}articles`).then((res) => res.data);
const getArticleById = (id) => axios.get(`${defaultUrl}articles/${id}`).then((res) => res.data);
const createArticle = (data) => axios.post(`${defaultUrl}articles`, data);
const updateArticle = (id, data) => axios.put(`${defaultUrl}articles/${id}`, data);
const deleteArticle = (id) => axios.delete(`${defaultUrl}articles/${id}`);
const getActicleComments = (id) => axios.get(`${defaultUrl}articles/${id}/comments`).then((res) => res.data);
const deleteArticleComment = (articleId, commentId) => axios.delete(`${defaultUrl}${articleId}/comments/${commentId}`);
const createActicleComment = (articleId, data) => axios.post(`${defaultUrl}articles/${articleId}/comments`, data);
const searchArticle = (query) => axios.get(`${defaultUrl}search`, {params: query}).then((res) => res.data);

module.exports = {
  getCategories,
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getActicleComments,
  deleteArticleComment,
  createActicleComment,
  searchArticle,
};
