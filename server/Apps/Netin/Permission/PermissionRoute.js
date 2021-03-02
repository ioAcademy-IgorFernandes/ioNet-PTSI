const express = require('express');
const PermissionController = require('./PermissionController');
let router = express.Router();

router.route('/')
    .post(PermissionController.add)
    .get(PermissionController.get);

router.route('/application/:idApp')
    .get(PermissionController.getByApp);

router.route('/:id')
    .put(PermissionController.update)
    .get(PermissionController.getById);

router.route('/:id/user/:idUser')
    .delete(PermissionController.removeUser);

module.exports = router;