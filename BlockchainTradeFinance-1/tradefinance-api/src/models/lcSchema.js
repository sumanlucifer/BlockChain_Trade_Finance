const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const lc = new Schema({
    id: ObjectId,
    LCId: {
        type: String,
        required: true
    },
    LCTokenNumber: {
        type: String,
        required: true
    },
    BuyerMetadata: {
        type: String,
        required: true
    },
    SellerMetadata:{
        type: String,
        required: true
    },
    ProductMetadata:{
        type: String,
        required: true
    },
    LCStatus: {
        type: String,
        required: true
    },
    OwnerAddress: {
        type: String,
        required: true
    }
    
}, {
    timestamps: true
});
const lcSchema = mongoose.model('lc', lc);
module.exports.lcSchema = lcSchema;