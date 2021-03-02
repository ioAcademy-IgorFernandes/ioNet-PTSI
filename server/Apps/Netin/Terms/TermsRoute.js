const express = require('express');
const TermsController = require('./TermsController');
let router = express.Router();

router.route('/')
    .post(TermsController.add)
    .get(TermsController.getActive);

router.route('/:id')
    .delete(TermsController.remove);

module.exports = router;