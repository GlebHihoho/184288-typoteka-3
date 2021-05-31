'use strict';

const getErrorMessage = (messages = []) => {
  const errorMessage = {};

  messages.forEach((message) => {
    const regExp = new RegExp(/"(.*?)"/gi);
    const [, key] = regExp.exec(message);
    const text = message.replace(regExp, ``).trim();
    errorMessage[key] = text;
  });

  return errorMessage;
};

const getArticleImage = (file, body) => {
  if (file && file.filename) {
    return file && file.filename;
  }

  if (body && body.image) {
    return body.image;
  }

  return ``;
};

const getCategoryArticle = (categories) => {
  if (Array.isArray(categories)) {
    return categories;
  }

  if (typeof categories === `string`) {
    return [categories];
  }

  return [];
};

module.exports = {
  getErrorMessage,
  getArticleImage,
  getCategoryArticle,
};
