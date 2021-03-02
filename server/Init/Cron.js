module.exports = (callback) => {
    const chalk = require("chalk");
    console.log(chalk.yellow("-- Initializing CRON"));
    const cron = require('node-cron');

    /*console.log(chalk.yellow("-- Initializing DialogFlow CRON"));
    const DialogFlowController = require("../Modules/DialogFlow/DialogFlowController");
    cron.schedule('0 0 10,12,14,16,18,20 * * *', () => {
        DialogFlowController.updateMoloniCostumers(()=>{});
        DialogFlowController.updateIOTechEmployees(()=>{});
        DialogFlowController.updateFactorialLeaveTypes(()=>{});
        DialogFlowController.updateClickupProjects(()=>{});
        return;
    });*/

    console.log(chalk.yellow("-- Initializing GoogleSheets CRON"));
    const GoogleSheetsController = require("../Modules/GoogleSheets/GoogleSheetsController");
    cron.schedule('0 */10 * * * *', () => {
        GoogleSheetsController.updateSheetInfo(()=>{});
        return;
    });
    //'0,3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57 * * * *'

    console.log(chalk.yellow("-- Initializing FactorialHR CRON"));
    const FactorialController = require("../Modules/Factorial/FactorialController");
    cron.schedule('0 */10 * * * *', () => {
        FactorialController.synchronize(()=>{});
        return;
    });
    //'0,3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57 * * * *'

    console.log(chalk.yellow("-- Initializing Clickup CRON"));
    const ClickupController = require("../Modules/Clickup/ClickupController");
    cron.schedule('0 0 9,11,13,15,17,19 * * *', () => {
        ClickupController.synchronize(()=>{});
        return;
    });
    //'0,3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57 * * * *'

    /*console.log(chalk.yellow("-- Initializing Tink CRON"));
    const TinkController = require("../Modules/Tink/TinkController");
    cron.schedule('0 0 9,11,13,15,18 * * *', () => {
        //TinkController.syncronizeTransactions(()=>{});
        return;
    });*/
    //'0,3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57 * * * *'

    return callback();
}