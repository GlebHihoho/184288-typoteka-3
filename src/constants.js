'use strict';

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.API_PREFIX = `/api`;

module.exports.USER_ARGV_INDEX = 2;

module.exports.EXIT_CODE = {
  ERROR: 1,
  SUCCESS: 0,
};

module.exports.HTTP_CODE = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};
