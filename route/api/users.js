const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { validateId } = require('../util/validator');
const auth = require('../../middleware/auth');
const { User, validateUser, validateUserUpdateRequest } = require('../models/users');
const asyncMiddleware = require('../../middleware/async');

const router = express.Router();
const selectQuery = 'firstName lastName phone email';

router.get('/me', auth, asyncMiddleware(async (req, res)=>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
}));

router.get('/', asyncMiddleware(async (req, res) => {
    const users = await User.find().select(selectQuery);
    res.send(users);
}));

router.post('/', asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email }).exec();
    if (user) return res.status(400).send("user already registered!");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: hashedPassword
    });

    user = await user.save();
    const { password: _, ...createdUser } = user._doc;
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(createdUser);
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
    if (!req.params.id) return res.status(400).send('Please send user id as req param');
    if (!validateId(req.params.id)) return res.status(400).send('Please send valid user id as req param');
    const { error } = validateUserUpdateRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    

    const user = await User.findById(req.params.id).select(selectQuery);
    if (!user) return res.status(404).send('The user with the given id was not found.');
    const {firstName, lastName, phone } = req.body;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    await user.save();

    res.send(user);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    if (!req.params.id) return res.status(400).send('Please send user id as req param');
    if (!validateId(req.params.id)) return res.status(400).send('Please send valid user id as req param');

    const user = await User.findById(req.params.id).select(selectQuery);
    if(!user) return res.status(404).send('The user with the give id was not found.');

    res.send(user);
}));

router.delete('/:id', asyncMiddleware(async(req, res) => {
    if (!req.params.id) return res.status(400).send('Please send user id as req param');
    if (!validateId(req.params.id)) return res.status(400).send('Please send valid user id as req param');

    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).send('The user with the give id was not found.');
    res.status(204).send(user);
}));


module.exports = router;
