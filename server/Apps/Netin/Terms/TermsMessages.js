module.exports = {
    success: {
        s0: {
            http: 200,
            code: "TermCreatedSuccesfully",
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
            http: 406,
            code: "NoRecordsFound",
            type: "error"
        },
        e1: {
            http: 406,
            code: "NumberAlreadyInUse",
            type: "error"
        }
    },
    invalid: {
        i0: {
            http: 406,
            code: "InvalidNumber",
            type: "error"
        },
        i1: {
            http: 406,
            code: "InvalidDescription",
            type: "error"
        },
        i2: {
            http: 406,
            code: "InvalidInternalRule",
            type: "error"
        },
        i3: {
            http: 406,
            code: "InvalidID",
            type: "error"
        }
    }
}