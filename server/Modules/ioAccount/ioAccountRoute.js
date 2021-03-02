const express = require('express');
const ioAccountController = require('./ioAccountController');
let router = express.Router();
/*
router.route('/')
    .post(ioAccountController.createAccount);
*/
router.route('/auth')
    .post(ioAccountController.login);

module.exports = router;