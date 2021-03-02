const express = require('express');
const ApplicationController = require('./ApplicationController');
let router = express.Router();

router.route('/')
    .post(ApplicationController.add)
    .get(ApplicationController.get)

router.route('/active')
    .get(ApplicationController.getActive)

router.route('/:id')
    .put(ApplicationController.update)
    .get(ApplicationController.readByID)
    .delete(ApplicationController.remove)

router.route('/user/:userId')
    .get(ApplicationController.getByUser)

router.route('/access/:id')
    .get(ApplicationController.createAccess);

router.route('/access')
    .post(ApplicationController.checkAccess);

module.exports = router;