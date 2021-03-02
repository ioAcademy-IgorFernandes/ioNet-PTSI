const express = require('express');
const GoogleSheetsController = require('./GoogleSheetsController');
let router = express.Router();

router.route('/workavg')
    .post(GoogleSheetsController.getWorkAvg);

router.route('/day')
    .post(GoogleSheetsController.getDay);

router.route('/employeeMonth')
    .post(GoogleSheetsController.getEmployeeWork);


module.exports = router;