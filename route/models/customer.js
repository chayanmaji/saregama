const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        require: true,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: () => false
    }
})

const Customer = new mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        require: true,
        minlength: 10,
        maxlength: 10
    },
    isGold: {
        type: Boolean,
        default: () => false
    }
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        phone: Joi.string()
            .min(10)
            .max(10)
            .required(),
        isGold: Joi.boolean()
    });

    return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;