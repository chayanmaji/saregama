const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const genres = require('./route/api/genres');
const customers = require('./route/api/customers');
const movies = require('./route/api/movies');
const rentals = require('./route/api/rentals');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connect('mongodb://127.0.0.1:27017/saregama')
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.error('Could not connect to the database'))

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));