'use strict';

const axios = require(`axios`);

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const axiosInstance = axios.create({
  baseURL: defaultUrl
});

const getCategories = () => axiosInstance.get(`categories`).then((res) => res.data);
const getArticles = () => axiosInstance.get(`articles`).then((res) => res.data);
const getArticleById = (id) => axiosInstance.get(`articles/${id}`).then((res) => res.data);
const createArticle = (data) => axiosInstance.post(`articles`, data);
const updateArticle = (id, data) => axiosInstance.put(`articles/${id}`, data);
const deleteArticle = (id) => axiosInstance.delete(`articles/${id}`);
const getActicleComments = (id) => axiosInstance.get(`articles/${id}/comments`).then((res) => res.data);
const deleteArticleComment = (articleId, commentId) => axiosInstance.delete(`${articleId}/comments/${commentId}`);
const createActicleComment = (articleId, data) => axiosInstance.post(`articles/${articleId}/comments`, data);
const searchArticle = (query) => axiosInstance.get(`search`, {params: query}).then((res) => res.data);

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
