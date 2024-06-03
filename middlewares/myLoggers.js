const { logger } = require("./logger");

const requestLogger = (req, res, next) => {
  logger(`${req.method}\t${req.url}\t${req.headers.origin}`, "req.txt");
  next();
};

const errorLogger = (err, req, res, next) => {
  logger(`${err.code}\t${err.stack}\t${err.message}`, "err.txt");
  next();
};

module.exports = { requestLogger, errorLogger };
