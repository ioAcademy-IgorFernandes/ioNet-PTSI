module.exports = {
    success: {
        s0: {
            http: 200,
            code: "NoData",
            type: "success"
        }
    },
    error: {
        e0: {
            http: 400,
            code: "NoData",
            type: "success"
        }
    },
    invalid: {
        i0: {
            http: 406,
            code: "InvalidMonthData",
            type: "success"
        },
        i1: {
            http: 406,
            code: "InvalidDate",
            type: "success"
        },
        i2: {
            http: 406,
            code: "InvalidName",
            type: "success"
        }
    }
}