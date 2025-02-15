const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const { Genre, validateGenre } = require('../models/genres');
const router = express.Router();
  
  router.get('/', async (req, res) => {
    const genres = await Genre.find();
    res.send(genres);
  });
  
  router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
  
    genre = await genre.save();
    res.send(genre);
  });
  
  router.put('/:id', async (req, res) => {
    if (!req.params.id) return res.status(400).send('Please send genre id as req param');
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    genre.name = req.body.name.trim();
    await genre.save();

    res.send(genre);
  });
  
  router.delete('/:id', async (req, res) => {
    if (!req.params.id) return res.status(400).send('Please send genre id as req param');
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
  });
  
  router.get('/:id', async (req, res) => {
    if (!req.params.id) return res.status(400).send('Please send genre id as req param');
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
  });
  


  module.exports = router;