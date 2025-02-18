const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./middleware/logger');
const app = express();
require("./startup/logging")();
require('./startup/route')(app);
require('./startup/db')();

// process.on('uncaughtException', (ex) => {
//     logger.log('error', ex.message , ex);
//     process.exit(1);
// });

// throw new Error("Parameter is not a number!");
// if (!config.get('jwtPrivateKey')) {
//     console.log('FATAL ERROR: jwtPrivateKey is not defined!');
//     process.exit(1);
// }

if (!process.env.SECRET_KEY) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));





const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));