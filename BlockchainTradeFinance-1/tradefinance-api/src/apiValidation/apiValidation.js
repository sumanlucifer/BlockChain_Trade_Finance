// const Joi = require('joi');
const JoiBase = require("@hapi/joi");
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date


const registrationSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

const buyerSchema = Joi.object({
    name: Joi.string().min(6).required(),
    address: Joi.string().min(6).required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    email: Joi.string().min(6).required().email(),
    bankName: Joi.string().min(6).required(),
    bankAccount: Joi.number().required()
});

const productdata = Joi.object({
    PROD_TYPE: Joi.string().required(),
    PROD_QTY: Joi.number().required(),
    PROD_PRICE: Joi.number().required(),
    TOTAL_VAL: Joi.number().required(),
    END_DATE: Joi.required(),
    INTEREST_RATE: Joi.number()
});






module.exports.register = registrationSchema;
module.exports.login = loginSchema;
module.exports.buyer = buyerSchema;
module.exports.productdata = productdata;
