const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genres');

const rentalSchema = new mongoose.Schema({
    customer : {
        type: new mongoose.Schema({
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
        }),
        require: true
    },
    movie : {
        type : new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlenght: 5,
                maxlenght: 50
            },
            genre : {
                type: genreSchema,
                required: false
            },
            dailyRentalRates: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        require: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = new mongoose.model('Rental', rentalSchema);

function validateRental (rental) {
    const schema = Joi.object({
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required()
    });

    return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
module.exports.rentalSchema = rentalSchema;