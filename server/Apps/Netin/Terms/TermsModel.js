const mongoose = require("mongoose");
const CONFIG = require("../NetinConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    number: {
        type: Number,
        unique: false,
        required: false,
        default: null
    },
    description: {
        type: String,
        unique: false,
        required: false,
        default: null
    },
    internal_rule: {
        type: Boolean,
        unique: false,
        required: true,
        default: null
    },
    creation_date: {
        type: Date,
        unique: false,
        required: true,
        default: null
    },
    active: {
        type: Boolean,
        unique: false,
        required: true,
        default: true
    }
});

module.exports = global.MongoConnection_ioDatabase.model(collection.terms, schema, collection.terms);