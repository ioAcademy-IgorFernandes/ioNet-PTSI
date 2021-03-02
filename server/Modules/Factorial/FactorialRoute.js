const express = require('express');
const FactorialController = require('./FactorialController');
let router = express.Router();

router.route('/createLeave')
    .post(FactorialController.postLeave);

router.route('/leave_types')
    .get(FactorialController.getLeaveTypes);

router.route('/clockin')
    .post(FactorialController.postClockIn);

router.route('/clockout')
    .post(FactorialController.postClockOut);

router.route('/shift')
    .get(FactorialController.getShift);

router.route('/')
    .put(FactorialController.updateToken);

router.route('/')
    .get((request, response) => {
        FactorialController.synchronize(() => {
            response.send()
        });
    }); 

module.exports = router;