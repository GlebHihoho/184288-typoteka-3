'use strict';

const axios = require(`axios`);

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const axiosInstance = axios.create({
  baseURL: defaultUrl
});

const createCategory = (data) => axiosInstance.post(`categories`, data);
const getCategories = () => axiosInstance.get(`categories`).then((res) => res.data);
const deleteCategory = (id) => axiosInstance.delete(`categories/${id}`);
const updateCategory = (id, data) => axiosInstance.patch(`categories/${id}`, data);

const getArticles = () => axiosInstance.get(`articles`).then((res) => res.data);
const getArticleById = (id) => axiosInstance.get(`articles/${id}`).then((res) => res.data);
const createArticle = (data) => axiosInstance.post(`articles`, data);
const updateArticle = (id, data) => axiosInstance.put(`articles/${id}`, data);
const deleteArticle = (id) => axiosInstance.delete(`articles/${id}`);
const getActicleComments = (id) => axiosInstance.get(`articles/${id}/comments`).then((res) => res.data);
const deleteArticleComment = (articleId, commentId) => axiosInstance.delete(`${articleId}/comments/${commentId}`);
const createActicleComment = (articleId, data) => axiosInstance.post(`articles/${articleId}/comments`, data);
const searchArticle = (search) => axiosInstance.get(`search`, {params: {search}}).then((res) => res.data);

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,

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
