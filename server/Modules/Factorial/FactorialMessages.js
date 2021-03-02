module.exports = {
    success: {
        s0: {
            http: 200,
            code: "SomethingDone",
            type: "success"
        },
        s1: {
            http: 200,
            code: "NoData",
            type: "success"
        },
        s2: {
            http: 200,
            code: "TokenUpdated",
            type: "success"
        }
    },
    error: {
        e0: {
            http: 406,
            code: "Something invalid",
            type: "error"
        }
    },
    invalid: {
        i0: {
            http: 406,
            code: "InvalidNetinID",
            type: "error"
        },
        i1: {
            http: 406,
            code: "InvalidCode",
            type: "error"
        },
        i2: {
            http: 406,
            code: "InvalidDate",
            type: "error"
        },
        i3: {
            http: 406,
            code: "InvalidStartDate",
            type: "error"
        },
        i4: {
            http: 406,
            code: "InvalidEndDate",
            type: "error"
        },
        i5: {
            http: 406,
            code: "InvalidLeaveType",
            type: "error"
        },
    }
}