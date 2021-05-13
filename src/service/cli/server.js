'use strict';

const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const app = require(`../start-server`);

const DEFAULT_PORT = 3000;

const logger = getLogger({name: `api`});

module.exports = {
  name: `--server`,
  run: async (args) => {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      return process.exit(1);
    }

    logger.info(`Connection to database established`);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    if (customPort <= 0) {
      return logger.error(`Port cannot be negative`);
    }

    return app
      .listen(port, () => logger.info(`Start server on PORT: ${port}`))
      .on(`error`, (error) => logger.error(`Server can't start. Error: ${error}`));
  },
};
