module.exports = {
    "middleware": "/NetinMiddleware",
    "routes": [{
        "path": "/netin/user",
        "file": "/User/UserRoute"
    }, {
        "path": "/netin/application",
        "file": "/Application/ApplicationRoute"
    }, {
        "path": "/netin/permission",
        "file": "/Permission/PermissionRoute"
    }, {
        "path": "/netin/presencetype",
        "file": "/PresenceType/PresenceTypeRoute"
    }, {
        "path": "/netin/employeeschedule",
        "file": "/EmployeeSchedule/EmployeeScheduleRoute"
    }, {
        "path": "/netin/recomendation",
        "file": "/Recomendation/RecomendationRoute"
    }, {
        "path": "/netin/terms",
        "file": "/Terms/TermsRoute"
    }, {
        "path": "/netin/applicationcookie",
        "file": "/ApplicationCookie/ApplicationCookieRoute"
    }]
}