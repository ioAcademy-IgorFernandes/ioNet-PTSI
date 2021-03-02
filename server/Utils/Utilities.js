const Asyncjs = require("async");

exports.remove = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
        if (prop)
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        else
            return arr.map(mapObj => mapObj).indexOf(obj) === pos;
    });
}

exports.resolve = (obj, path) => {
    path = path.split('.');
    var current = obj;
    while (path.length) {
        if (typeof current !== 'object') return undefined;
        current = current[path.shift()];
    }
    return current;
}

exports.validateNIF = (nif_nipc) => {
    try {

        let valid = true;

        if (
            nif_nipc.substr(0, 1) != '2' &&
            nif_nipc.substr(0, 1) != '3' &&
            nif_nipc.substr(0, 1) != '1' &&
            nif_nipc.substr(0, 2) != '45' &&
            nif_nipc.substr(0, 1) != '5' &&
            nif_nipc.substr(0, 1) != '6' &&
            nif_nipc.substr(0, 2) != '70' &&
            nif_nipc.substr(0, 2) != '71' &&
            nif_nipc.substr(0, 2) != '72' &&
            nif_nipc.substr(0, 2) != '77' &&
            nif_nipc.substr(0, 2) != '79' &&
            nif_nipc.substr(0, 1) != '8' &&
            nif_nipc.substr(0, 2) != '90' &&
            nif_nipc.substr(0, 2) != '91' &&
            nif_nipc.substr(0, 2) != '98' &&
            nif_nipc.substr(0, 2) != '99'
        ) {
            valid = false;
        }
        let check1 = nif_nipc.substr(0, 1) * 9;
        let check2 = nif_nipc.substr(1, 1) * 8;
        let check3 = nif_nipc.substr(2, 1) * 7;
        let check4 = nif_nipc.substr(3, 1) * 6;
        let check5 = nif_nipc.substr(4, 1) * 5;
        let check6 = nif_nipc.substr(5, 1) * 4;
        let check7 = nif_nipc.substr(6, 1) * 3;
        let check8 = nif_nipc.substr(7, 1) * 2;

        let total = check1 + check2 + check3 + check4 + check5 + check6 + check7 + check8;
        let division = total / 11;
        let module = total - parseInt(division) * 11;
        if (module == 1 || module == 0) {
            comparator = 0;
        } else {
            comparator = 11 - module;
        }

        let last_digit = nif_nipc.substr(8, 1) * 1;
        if (last_digit != comparator) {
            valid = false;
        }

        return valid;

    } catch (error) {
        return false;
    }


}

exports.findDuplicateEmail = (email, Models, callback) => {

    let stack = [];
    let duplicate = false;

    if (email) {
        for (let Model of Models) {
            stack.push((callback) => {
                Model.find({
                    $or: [{
                        "info.contact.email": {
                            $regex: email,
                            $options: "i"
                        }
                    }, {
                        "auth.email": {
                            $regex: email,
                            $options: "i"
                        }
                    }, {
                        "info.company.contact.email": {
                            $regex: email,
                            $options: "i"
                        }
                    }]
                }, (error, users) => {
                    if (error) throw new Error(error);
                    if (users.length > 0)
                        duplicate = true;
                    return callback();
                });
            });
        }

        Asyncjs.parallel(stack, () => {
            return callback(duplicate);
        });
    } else
        return callback(duplicate);

}

exports.findDuplicateNIF = (nif_nipc, Models, callback) => {

    let stack = [];
    let duplicate = false;

    if (nif_nipc) {
        for (let Model of Models) {
            stack.push((callback) => {
                Model.find({
                    "info.nif_nipc": nif_nipc
                }, (error, providers) => {
                    if (error) throw new Error(error);
                    if (providers.length > 0)
                        duplicate = true;
                    return callback();
                });
            });
        }

        Asyncjs.parallel(stack, () => {
            return callback(duplicate);
        });
    } else
        return callback(duplicate);
}

exports.checkAge = (birthday) => {
    let date1 = new Date(birthday);
    let date2 = new Date();
    let diff = (date2.getTime() - date1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));
}

exports.joinTwoObjects = (obj1, obj2) => {
    let finalobj = {};
    for (let _obj in obj1) exports.setObjectPath(finalobj, _obj, obj1[_obj]);
    for (let _obj in obj2) exports.setObjectPath(finalobj, _obj, obj2[_obj]);
    return finalobj;
}

exports.setObjectPath = (obj, path, value) => {
    var parts = path.split('.');
    var o = obj;
    if (parts.length > 1) {
        for (var i = 0; i < parts.length - 1; i++) {
            if (!o[parts[i]])
                o[parts[i]] = {};
            o = o[parts[i]];
        }
    }

    o[parts[parts.length - 1]] = value;
}

exports.cloneObject = (obj) => {
    return require('lodash.clonedeep')(obj);
}

exports.isObjectEqual = (a, b) => {

    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length)
        return false;

    for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];
        if (a[propName] !== b[propName])
            return false;
    }

    return true;
}

exports.jsonToDot = (a) => {
    var list = {};
    (function (o, r) {
        r = r || '';
        if (typeof o != 'object') {
            return true;
        }
        for (var c in o) {
            if (arguments.callee(o[c], r + "." + c)) {
                let p = ''
                if (r.substring(1))
                    p = r.substring(1) + "." + c
                else
                    p = c
                list[p] = o[c];
            }
        }
        return false;
    })(a);
    return list;
}

exports.dotToJson = (obj) => {
    let parseDotNotation = (str, val, obj) => {
        var currentObj = obj,
            keys = str.split("."),
            i, l = Math.max(1, keys.length - 1),
            key;

        for (i = 0; i < l; ++i) {
            key = keys[i];
            currentObj[key] = currentObj[key] || {};
            currentObj = currentObj[key];
        }

        currentObj[keys[i]] = val;
        delete obj[str];
    }

    for (var key in obj) {
        if (key.indexOf(".") !== -1) {
            parseDotNotation(key, obj[key], obj);
        }
    }
    return obj;
}