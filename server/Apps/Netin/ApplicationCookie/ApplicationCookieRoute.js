const express = require('express');
const ApplicationCookieController = require('./ApplicationCookieController');
let router = express.Router();
/*
router.route('/')
    .post(ApplicationCookieController.add)
    .get(ApplicationCookieController.get)
    .put(ApplicationCookieController.update)
    .delete(ApplicationCookieController.remove);
*/
module.exports = router;