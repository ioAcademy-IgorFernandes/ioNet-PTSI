const mongoose = require("mongoose");
const CONFIG = require("./ClickupConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    netin_id: {
        type: String,
        unique: false,
        required: true
    },
    token: {
        type: Object,
        default: null
    },
    type: {
        type: String,
        default: null
    }
});

let schema_records = new mongoose.Schema({
    assignees: [{
        type: String,
        unique: false,
        required: true
    }],
    info: {
        type: Object,
        default: null
    }
});

const Clickup = global.MongoConnection_ioDatabase.model(collection.clickup, schema, collection.clickup);
const ClickupRecords = global.MongoConnection_ioDatabase.model(collection.clickup_records, schema_records, collection.clickup_records);

module.exports = {
    Clickup,
    ClickupRecords
}