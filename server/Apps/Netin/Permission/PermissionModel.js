const mongoose = require("mongoose");
const CONFIG = require("../NetinConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    idApp: {
        type: String,
        required: true
    },
    idUsers: [{
        idUser: {
            type: String,
            required: true
        }
    }]
});

module.exports = global.MongoConnection_ioDatabase.model(collection.permission, schema, collection.permission);