const SANITIZE_CONFIG = {
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËẼÌÍÎÏĨÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëẽìíîïĩðñòóôõöøùúûüýÿ",
    numerical: "0123456789",
    allowed: "\\.\\-\\(\\)\\[\\]\\_\\ \\ª\\º\\?\\#\\~\\!\\+\\,\\*\\:\\@/\/=&",
    date: "01234567891\-\.\:TZ",
    coordinates: "0123456789-.,",
    boolean: "truefalsn"
};

const Utilities = require("@Utilities");

exports.whitelist = (string, characters_temp) => {

    if (!string) return null;

    let characters = joinCharacters(characters_temp);
    if (characters != "") {

        try {
            string = string.toString();
            let split_string = string.split("");
            let final_string = "";

            for (let character of split_string) {
                let allow = false;

                for (let allowed_character of characters) {
                    if (character == allowed_character)
                        allow = true;
                }
                if (allow)
                    final_string = final_string + character;
            }
            return final_string;
        } catch (ex) {
            return string;
        }
    } else
        return string;

};


exports.blacklist = (string, characters_temp) => {

    if (!string) return null;

    let characters = joinCharacters(characters_temp);
    if (characters != "") {

        try {
            string = string.toString();
            let split_string = string.split("");
            let final_string = "";

            for (let character of split_string) {
                let allow = true;

                for (let allowed_character of characters) {
                    if (character == allowed_character)
                        allow = false;
                }
                if (allow)
                    final_string = final_string + character;
            }
            return final_string;

        } catch (ex) {
            return string;
        }
    } else
        return string;
};

let joinCharacters = (expressions) => {

    let characters = "";

    for (let type of expressions) {
        switch (type) {
            case "alphabet":
                characters += SANITIZE_CONFIG.alphabet;
                break;
            case "numerical":
                characters += SANITIZE_CONFIG.numerical;
                break;
            case "allowed":
                characters += SANITIZE_CONFIG.allowed;
                break;
            case "date":
                characters += SANITIZE_CONFIG.date;
                break;
            case "coordinates":
                characters += SANITIZE_CONFIG.coordinates;
                break;
            case "boolean":
                characters += SANITIZE_CONFIG.boolean;
                break;
            default:
                characters += type;
                break;
        }
    }
    return characters;
}

exports.sanitizeBody = (body, fields, SANITIZE_CONFIG) => {

    let new_info = {};

    for (let i in fields) {
        try {
            if (Utilities.resolve(body, fields[i]).constructor == Array) {
                let temp = Utilities.resolve(body, fields[i]);
                for (let k in temp) {
                    Utilities.resolve(body, fields[i])[k] = exports.whitelist(temp[k], SANITIZE_CONFIG[i]);
                }
                new_info[fields[i]] = Utilities.resolve(body, fields[i]);
            } else
                new_info[fields[i]] = exports.whitelist(Utilities.resolve(body, fields[i]), SANITIZE_CONFIG[i]);
        } catch (error) {
            new_info[fields[i]] = Utilities.resolve(body, fields[i]);
        }
    }
    return new_info;
}