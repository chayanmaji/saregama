const mongoose = require('mongoose');

const validateId = id => mongoose.isValidObjectId(id);

module.exports.validateId = validateId;