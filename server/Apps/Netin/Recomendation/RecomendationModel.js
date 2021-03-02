const mongoose = require("mongoose");
const CONFIG = require("../NetinConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    idApplication: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    feedbacks: [{
        feedback: {
            type: String,
            required: true
        },
        date: {
            type: Date,
        },
        isActive: {
            type: Boolean
        }
    }]
});
module.exports = global.MongoConnection_ioDatabase.model(collection.recomendation, schema, collection.recomendation);