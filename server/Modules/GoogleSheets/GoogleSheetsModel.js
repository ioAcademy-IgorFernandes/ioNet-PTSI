const mongoose = require("mongoose");
const CONFIG = require("./GoogleSheetsConfig");
let collection = CONFIG.mongodb.collections;

let sheets = new mongoose.Schema({
    sheet_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: false,
        required: false
    },
    netin_id: {
        type: String,
        required: false,
        default: null
    },
    name: {
        type: String,
        required: false,
        default: null
    },
    year: {
        type: Number,
        unique: false,
        required: false
    },
    month: {
        type: Number,
        unique: false,
        required: false
    },
    employee_work_register: [{
        type: { type: String, require: true }, //work at iotech,rest, etc.
        day: { type: Date, require: true },
        day_period: { type: String, require: true }
    }]
});

let token = new mongoose.Schema({
    type: {
        type: String,
        unique: false,
        required: false
    },
    token: {
        type: Object,
        unique: false,
        required: false
    }
});

let api = new mongoose.Schema({
    type: {
        type: String,
        unique: false,
        required: false
    },
    last_update: {
        type: Date,
        unique: false,
        required: false
    }
});

const Token = global.MongoConnection_ioDatabase.model('token', token, collection.googlesheets_management);
const GoogleSheets = global.MongoConnection_ioDatabase.model(collection.googlesheets, sheets, collection.googlesheets);
const API = global.MongoConnection_ioDatabase.model('api', api, collection.googlesheets_management);

module.exports = {
    Token: Token,
    GoogleSheets: GoogleSheets,
    API:API
}