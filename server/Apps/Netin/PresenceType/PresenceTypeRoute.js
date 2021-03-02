const express = require('express');
const PresenceTypeController = require('./PresenceTypeController');
let router = express.Router();

router.route('/')
    .post(PresenceTypeController.add)
    .get(PresenceTypeController.get);

router.route('/active')
    .get(PresenceTypeController.getActive);

router.route('/:id')
    .get(PresenceTypeController.getById)
    .delete(PresenceTypeController.deactivate);

router.route('/:id/activate')
    .put(PresenceTypeController.activate);

module.exports = router;