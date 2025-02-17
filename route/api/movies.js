const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const { Movie, validateMovie } = require('../models/movies');
const { validateId } = require('../util/validator');
const { Genre } = require('../models/genres');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    if (!req.params.id) return res.status(400).send('Please send movie id as request param');
    if (!validateId(req.params.id)) return res.status(400).send('Please send valid movie id as req param');
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(400).send('The movie with the given id was not found.');

    return res.send(movie);
})

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid Genre Id');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRates: req.body.dailyRentalRates
    });
    await movie.save();

    res.send(movie);
})

router.put('/:id', async(req, res) => {
    if (!req.params.id) return res.status(400).send('Please send movie id as req param');
    if (!validateId(req.params.id)) return res.status(400).send('Please send valid movie id as req param');
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid Genre Id');

    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(400).send('The movie with the given id was not found');

    movie.title = req.body.title;
    movie.genre._id = req.body.genreId;
    movie.genre.name = genre.name;
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRates = req.body.dailyRentalRates;
    await movie.save();

    res.send(movie);
});

router.delete('/:id', async(req, res) => {
    if(!req.params.id) return res.status(400).send('Please send movie Id as request param');
    if (!validateId(req.params.id)) return res.status(400).send('Please send valid movie id as req param');
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(400).send('The movie with the given id was not found.');
    res.send(movie);
})

module.exports = router;