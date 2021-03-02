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
                pt: "PresenceType guardadas com sucesso",
                eng: "PresenceType saved successfully!"
            },
            type: "success"
        },
        s2: {
            http: 200,
            code: "ActivatedSuccessfully",
            message: {
                pt: "PresenceType ativada com sucesso",
                eng: "PresenceType activated successfully!"
            },
            type: "success"
        },
        s3: {
            http: 200,
            code: "DeactivatedSuccessfully",
            message: {
                pt: "PresenceType desativada com sucesso",
                eng: "PresenceType deactivated successfully!"
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
                pt: "PresenceTypes não encontradas",
                eng: "PresenceTypes not found"
            },
            type: "error"
        }
    },
    invalid: {
        i0: {
            http: 406,
            code: "InvalidName",
            type: "error"
        },
        i1: {
            http: 406,
            code: "InvalidDescription",
            type: "error"
        },
        i2: {
            http: 406,
            code: "InvalidID",
            type: "error"
        }
    }
}