const express = require('express');
const genres = require('../route/api/genres');
const customers = require('../route/api/customers');
const movies = require('../route/api/movies');
const rentals = require('../route/api/rentals');
const users = require('../route/api/users');
const auth = require('../route/api/auth');
const error = require('../middleware/error');

module.exports = function(app) {
    
    app.use(express.json());
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(error);
}