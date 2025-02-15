const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const { Customer , validateCustomer} = require('../models/customer');
const router = express.Router();



router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
})

router.get('/:id', async (req , res) => {
    if (!req.params.id) return res.status(400).send('Please send customer id as req param');
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given id was not found.');
    res.send(customer);
})

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, phone, isGold } = req.body;
    let customer = new Customer({ name, phone, isGold });
    customer = await customer.save();
    res.send(customer);
})

router.put('/:id', async (req, res) => {
    if (!req.params.id) return res.status(400).send('Please send customer id as req param');
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(400).send('The customer with the given id was not found');
    customer.name = req.body.name.trim();
    customer.phone = req.body.phone.trim();
    customer.isGold = req.body.isGold;
    await customer.save();

    res.send(customer);
})

router.delete('/:id', async (req, res) => {
    if (!req.params.id) return res.status(400).send('Please send customer id as req param');
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given id was not found');

    res.send(customer);
})


module.exports = router;