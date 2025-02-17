const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwtPayload = require('../util/jwt-payload');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    phone:{
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength : 1023
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(jwtPayload(this), process.env.SECRET_KEY);
}

const User = new mongoose.model('User', userSchema);

const validateUser = (user) => {
    const schema = Joi.object({
        firstName: Joi.string()
                    .max(255)
                    .required(),
        lastName: Joi.string()
                    .max(255)
                    .required(),
        phone: Joi.string()
                .min(10)
                .max(10)
                .required(),
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

const validateUserUpdateRequest = (user) => {
    const schema = Joi.object({
        firstName: Joi.string()
                    .max(255)
                    .required(),
        lastName: Joi.string()
                    .max(255)
                    .required(),
        phone: Joi.string()
                .min(10)
                .max(10)
                .required(),
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validateUserUpdateRequest = validateUserUpdateRequest;
module.exports.userSchema = userSchema;