const mongoose = require("mongoose");
const CONFIG = require("../NetinConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    user_id: {
        type: String,
        unique: false,
        required: false,
        default: null
    },
    application_id: {
        type: String,
        unique: false,
        required: false,
        default: null
    },
    application_url: {
        type: String,
        unique: false,
        required: false,
        default: null
    },
    cookie: {
        type: String,
        unique: false,
        required: false,
        default: null
    },
    creation_date: {
        type: Date,
        unique: false,
        required: false,
        default: null
    },
    expiration_date: {
        type: Date,
        unique: false,
        required: false,
        default: null
    },
    active: {
        type: Boolean,
        unique: false,
        required: false,
        default: true
    },
});

module.exports = global.MongoConnection_ioDatabase.model(collection.applicationcookie, schema, collection.applicationcookie);