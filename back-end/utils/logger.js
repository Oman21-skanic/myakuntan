// utils/logger.js
const {createLogger, format, transports} = require('winston');

const logger = createLogger({
  level: 'error',
  format: format.combine(
      format.timestamp(),
      format.json(),
  ),
  transports: [
    new transports.File({filename: 'logs/error.log', level: 'error'}),
    new transports.Console({format: format.simple()}), // optional: log ke console juga
  ],
});

module.exports = logger;
