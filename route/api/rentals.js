const mongoose = require('mongoose');
const express = require('express');
const { rentalSchema, Rental, validateRental } = require('../models/rentals');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movies');
const { Genre } = require('../models/genres');
const asyncMiddleware = require('../../middleware/async');

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
}));

router.post('/', asyncMiddleware(async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Customer was not found with the given id.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Movie was not find with the given id.');

    const genre = await Genre.findById(movie.genre._id);
    

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRates: movie.dailyRentalRates,
            genre: genre
        }
    });
    rental = await rental.save();

    movie.numberInStock = movie.numberInStock - 1;
    movie.save();

    res.send(rental);
}));

module.exports = router;