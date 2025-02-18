const mongoose = require('mongoose');
const logger = require('../middleware/logger');

module.exports = function() {
    mongoose.connect('mongodb://127.0.0.1:27017/saregama')
    .then(() => logger.log('info', 'connected to MongoDB'))
}