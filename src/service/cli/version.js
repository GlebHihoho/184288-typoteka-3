'use strict';

const chalk = require(`chalk`);
const packageJsonFile = require(`../../../package.json`);
const {logger} = require(`../lib/logger`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    logger.info(chalk.blue(version));
  }
};
