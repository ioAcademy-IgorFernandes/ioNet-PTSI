const express = require('express');
const EmployeeScheduleController = require('./EmployeeScheduleController');
let router = express.Router();

router.route('/')
    .post(EmployeeScheduleController.add)
    .get(EmployeeScheduleController.get);
    //.delete(EmployeeScheduleController.remove);

router.route('/:id')
    .get(EmployeeScheduleController.getById)
    .put(EmployeeScheduleController.addDay);

router.route('/:id/day/:idDay')
    .delete(EmployeeScheduleController.removeDay);

router.route('/user/:id')
    .get(EmployeeScheduleController.getByUserId);

router.route('/user/:id/year/:year')
    .get(EmployeeScheduleController.getByUserYear);

router.route('/user/:id/year/:year/month/:month')
    .get(EmployeeScheduleController.getByUserYearMonth);

module.exports = router;