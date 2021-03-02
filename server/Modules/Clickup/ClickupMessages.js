module.exports = {
    success: {
        s0: {
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
            code: "InvalidCode",
            type: "error"
        },
        i1: {
            http: 406,
            code: "InvalidTeamID",
            type: "error"
        },
        i2: {
            http: 406,
            code: "InvalidArchivedParam",
            type: "error"
        },
        i3: {
            http: 406,
            code: "InvalidSpaceID",
            type: "error"
        },
        i4: {
            http: 406,
            code: "InvalidFolderID",
            type: "error"
        },
        i5: {
            http: 406,
            code: "InvalidListID",
            type: "error"
        }
    }
}