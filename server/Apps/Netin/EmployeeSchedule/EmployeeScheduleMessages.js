module.exports = {
    success: {
        s0: {
            http: 200,
            code: "SomethingDone",
            type: "success"
        },
        s1: {
            http: 200,
            code: "SavedSuccess",
            message: {
                pt: "Employee Schedules guardadas com sucesso",
                eng: "Employee Schedules saved successfully!"
            },
            type: "success"
        },
        s2: {
            http: 200,
            code: "UpdatedSuccessfully",
            message: {
                pt: "Employee Schedules atualizadas com sucesso",
                eng: "Employee Schedules updated successfully!"
            },
            type: "success"
        },
        s3: {
            http: 200,
            code: "RemovedSuccessfully",
            message: {
                pt: "Employee Schedules removido com sucesso",
                eng: "Employee Schedules removed successfully!"
            },
            type: "success"
        }
    },
    error: {
        e0: {
            http: 406,
            code: "Something invalid",
            type: "error"
        },
        e1: {
            http: 404,
            code: "NoRecordsFound",
            message: {
                pt: "Employee Schedules não encontradas",
                eng: "Employee Schedules not found"
            },
            type: "error"
        },
        e2: {
            http: 404,
            code: "ScheduleAlreadyCreated",
            message: {
                pt: "Schedule já existente",
                eng: "Schedule Already Created"
            },
            type: "error"
        },
        e3: {
            http: 404,
            code: "InvalidDate",
            message: {
                pt: "Data Inválida",
                eng: "Invalid Date"
            },
            type: "error"
        }
    },
    invalid: {
        i0: {
            http: 406,
            code: "InvalidID",
            type: "error"
        },
        i1: {
            http: 406,
            code: "InvalidYear",
            type: "error"
        },
        i2: {
            http: 406,
            code: "InvalidMonth",
            type: "error"
        },
        i3: {
            http: 406,
            code: "InvalidDays",
            type: "error"
        },
        i4: {
            http: 406,
            code: "InvalidPresenceType",
            type: "error"
        },
        i5: {
            http: 406,
            code: "InvalidDayID",
            type: "error"
        }
    }
}