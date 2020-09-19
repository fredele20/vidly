const mongoose = require('mongoose')
const Joi = require('joi')

const Customer = mongoose.model("Customer", new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true
    }
}))


function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(3).required(),
        isGold: Joi.boolean()
    }

    return Joi.validate(customer, schema)
}

exports.Customer = Customer;
exports.validate = validateCustomer;
