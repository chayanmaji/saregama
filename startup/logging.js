const logger = require('../middleware/logger');

module.exports = function () {
    process.on('uncaughtException', (ex) => {
        console.log('uncaughtexception');
        logger.log('error', ex.message , ex);
        process.exit(1);
    });
}