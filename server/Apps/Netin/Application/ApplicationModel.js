const mongoose = require("mongoose");
const CONFIG = require("../NetinConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    application: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date
    },
    isActive: {
        type: Boolean,
        unique: false,
        required: true,
        default: true
    },
    url: {
        type: String,
        required: true
    }
});

module.exports = global.MongoConnection_ioDatabase.model(collection.application, schema, collection.test);