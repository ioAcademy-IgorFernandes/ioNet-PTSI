module.exports = {
    "mongodb": {
        "collections": {
            "user": "netin_user",
            "application": "netin_application",
            "permission": "netin_permission",
            "presencetype": "netin_presencetype",
            "employeeschedule": "netin_employeeschedule",
            "recomendation": "netin_recomendation",
            "terms": "netin_terms",
            "applicationcookie": "netin_applicationcookie",
            "reports": "netin_reports"
        }
    },
    "authorized_ips":["127.0.0.1", "127.0.0.2"],
    "workdays":[1, 2, 3, 4, 5]
}

/*
workdays: 1 => Monday;
          2 => Tuesday;
          ........
          ........
          7 => Sunday;
*/