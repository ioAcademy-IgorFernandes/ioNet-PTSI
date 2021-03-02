const express = require('express');
const ClickupController = require('./ClickupController');
let router = express.Router();

//router.route('/')
    //.get(ClickupController.synchronize)

router.route('/token')
    .post(ClickupController.updateToken)

router.route('/user')
    .get(ClickupController.getUserInfo)

router.route('/team')
    .get(ClickupController.getTeams)

router.route('/team/:team_id/space/archived/:is_archived')
    .get(ClickupController.getSpaces)

router.route('/space/:space_id/folder/archived/:is_archived')
    .get(ClickupController.getFolders)

router.route('/folder/:folder_id/list/archived/:is_archived')
    .get(ClickupController.getLists)

router.route('/list/:list_id/task/archived/:is_archived')
    .get(ClickupController.getTasks)

module.exports = router;