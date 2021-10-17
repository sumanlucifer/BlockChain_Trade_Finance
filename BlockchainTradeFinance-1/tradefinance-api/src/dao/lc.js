const mongoose = require('mongoose');
const {lcSchema} = require('../models/lcSchema');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
class lcDetails{
    create(data){
        const lcHistory =  new lcSchema(data);
        return lcHistory.save();
    }
    getAll(){
        return lcSchema.find({});
    }
    getById(id){
        return lcSchema.findOne({LCId:id});
    }
    deleteByLcId(id){
        return lcSchema.deleteMany({LCId:id});
    }
}

module.exports = new lcDetails();