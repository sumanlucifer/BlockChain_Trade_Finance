const JoiBase = require("@hapi/joi");
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

const lcSchema = Joi.object({
    LCTokenNumber: Joi.string().required(),
    LCStatus: Joi.string().required(),
    ProductQuantity: Joi.number().required(),
    PricePerUnit: Joi.number().required(),
    TotalValue: Joi.number().required(),
    MaturityDate: Joi.required()
});

module.exports.lc = lcSchema;