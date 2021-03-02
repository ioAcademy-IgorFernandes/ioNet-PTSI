const mongoose = require("mongoose");
const CONFIG = require("../NetinConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    idUser: {
        type: String,
        unique: false,
        required: true
    },
    year: {
        type: Number,
        unique: false,
        required: true
    },
    month: {
        type: Number,
        unique: false,
        required: true
    },
    days: [
        {
            day:{
                type: Number,
                unique: false,
                required: true
            },
            day_of_week:{
                type: Number,
                unique: false,
                required: true
            },
            presence_type:{
                type: Object,
                unique: false,
                required: true
            },
        }
    ]
});

module.exports = global.MongoConnection_ioDatabase.model(collection.employeeschedule, schema, collection.employeeschedule);