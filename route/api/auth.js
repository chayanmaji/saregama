const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const asyncMiddleware = require('../../middleware/async');
const { User } = require('../models/users');
const jwtPayload = require('../util/jwt-payload');
const router = express.Router();

router.post('/', asyncMiddleware(async (req, res) => {
    const { error } = validateLoginRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email}).exec();
    if (!user) return res.status(400).send('Incorrect email or password!');

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) return res.status(400).send('Incorrect email or password!');

    const token = user.generateAuthToken();

    res.send(token);
}));

const validateLoginRequest = (user) => {
    const schema = Joi.object({
        email: Joi.string()
                .email({ tlds: { allow: false } })    
                .required(),
        password: Joi.string()
                    .min(5)
                    .max(255)
                    .required()
    });

    return schema.validate(user);
}

module.exports = router;
