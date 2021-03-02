const mongoose = require("mongoose");
const CONFIG = require("./FactorialConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    netin_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: false,
        required: false,
        default: null
    },
    factorial_id: {
        type: Number,
        default: null
    },
    type: {
        type: String,
        default: 'user_token'
    },
    token: {
        type: Object,
        unique: false,
        required: false,
        default: null
    }
});

let clockSchema = new mongoose.Schema({
    type: {
        type: String
    },
    employee_id: {
        type: String,
        required: false,
        default: null
    },
    netin_id: {
        type: String,
        required: false,
        default: null
    },
    year: {
        type: Number,
        required: false,
        default: null
    },
    month: {
        type: Number,
        required: false,
        default: null
    },
    days: [{
        day: { type: Number, required: true },
        in: { type: Date, required: true },
        out: { type: Date, required: true },
    }]
});

let leaveSchema = new mongoose.Schema({
    type: {
        type: String
    },
    netin_id: {
        type: String,
        required: false,
        default: null
    },
    leave: {
        type: Object,
        required: false,
        default: null
    },
    savedDate: {
        type: Date,
        required: false,
        default: null
    }
});

const Token = global.MongoConnection_ioDatabase.model(collection.factorial_token, schema, collection.factorial_token);
const Shift = global.MongoConnection_ioDatabase.model(collection.factorial_shift, clockSchema, collection.factorial_shift);
const Leave = global.MongoConnection_ioDatabase.model(collection.factorial_leave, leaveSchema, collection.factorial_leave);

module.exports = {
    Token: Token,
    Shift: Shift,
    Leave: Leave
}