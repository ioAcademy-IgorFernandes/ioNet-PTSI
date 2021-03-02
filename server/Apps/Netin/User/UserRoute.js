const express = require('express');
const UserController = require('./UserController');
let router = express.Router();

router.route('/')
    .post(UserController.add)
    .get(UserController.get)

router.route('/logged')
    .get(UserController.getAuthenticatedUser)  

router.route('/:idUser')
    .put(UserController.update)
    .get(UserController.getByID)
    .delete(UserController.remove)

router.route('/group/:group')
    .get(UserController.getByGroup)

router.route('/terms/:idUser')
    .put(UserController.updateTerms)

module.exports = router;