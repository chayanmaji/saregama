// const winston = require('winston');
const logger = require('./logger');

module.exports = function(err, req, res, next) {
    // winston.error(err.message, err);
    logger.log('error', err);
    return res.status(500).send('Something went wrong!');
}