const express = require('express');
const RecomendationController = require('./RecomendationController');
let router = express.Router();

router.route('/')
    .post(RecomendationController.add)
    .get(RecomendationController.get)

router.route('/user/:idUser')
    .get(RecomendationController.readByIDUser)

router.route('/:id')
    .put(RecomendationController.put)
    .get(RecomendationController.readByID)

router.route('/:id/feedback/:idFeedback')
    .delete(RecomendationController.delete)

router.route('/application/:idApp/user/:idUser')
    .get(RecomendationController.readByIdAppIdUser)

router.route('/application/:idApp')
    .get(RecomendationController.readByIdApp)

module.exports = router;