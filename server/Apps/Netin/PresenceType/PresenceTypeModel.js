const mongoose = require("mongoose");
const CONFIG = require("../NetinConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    description: {
        type: String,
        unique: false,
        required: false
    },
    isActive: {
        type: Boolean,
        unique: false,
        required: true,
        default: true
    }
});

module.exports = global.MongoConnection_ioDatabase.model(collection.presencetype, schema, collection.presencetype);