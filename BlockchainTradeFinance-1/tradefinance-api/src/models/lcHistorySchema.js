const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const lcHistory = new Schema({
    id: ObjectId,
    LCId: {
        type: String,
        required: true
    },
    LCTokenNumber: {
        type: String,
        required: true
    },
    LCStatus: {
        type: String,
        required: true
    },
    ChangedOn: {
        type: String,
        required: true
    },
    ChangedByName: {
        type: String
        // required: true
    },
    ChangedBy: {
        type: String,
        required: true
    },
    OwnerAddress: {
        type: String,
        required: true
    },
    ChangeType: {
        type: String,
        required: true,
        default: 'Status Update'
    },
    createdBy: {
        type: String,
        // required: true
    }
}, {
    timestamps: true
});
const lcHistorySchema = mongoose.model('lcHistory', lcHistory);
exports.lcHistorySchema = lcHistorySchema;