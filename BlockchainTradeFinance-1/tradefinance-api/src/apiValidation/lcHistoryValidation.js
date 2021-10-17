const JoiBase = require("@hapi/joi");
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

const lcHistorySchema = Joi.object({
    LCTokenNumber: Joi.string().required(),
    LCStatus: Joi.string().required(),
    ChangedOn: Joi.required(),
    ChangedBy: Joi.string().required(),
    ChangeType: Joi.string().required()
});
module.exports.lcHistory = lcHistorySchema;
