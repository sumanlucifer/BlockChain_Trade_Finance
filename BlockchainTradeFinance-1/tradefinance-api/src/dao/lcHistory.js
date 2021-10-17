const mongoose = require('mongoose');
const { lcHistorySchema } = require('../models/lcHistorySchema');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
class lcHistoryDetails {
    create(data) {
        const lcHistory = new lcHistorySchema(data);
        return lcHistory.save();
    }
    getAll() {
        return lcHistorySchema.find({});
    }
    getById(id) {
        return lcHistorySchema.find({ LCTokenNumber: id });
    }
    getByIdOne(LCid) {
        return lcHistorySchema.findOne({ LCId: LCid }).sort({ createdAt: -1 });
    }
    getByIdLcToken(LCTokenNumber) {
        return lcHistorySchema.find({ LCTokenNumber }).sort({ ChangedOn: 1 });
    }
    deleteByLcId(id) {
        return lcHistorySchema.deleteMany({ LCId: id });
    }

}

module.exports = new lcHistoryDetails();