module.exports = (callback) => {

    const chalk = require("chalk");
    console.log(chalk.yellow("-- Forcing package changes"));

    let ObjectId = require("../../node_modules/mongoose/lib/schema/objectid");
    const SchemaType = require("../../node_modules/mongoose/lib/schematype");
    const Document = require('../../node_modules/mongoose/lib/document');

    ObjectId.prototype.cast = function (value, doc, init) {

        if (SchemaType._isRef(this, value, doc, init)) {
            // wait! we may need to cast this to a document

            if (value === null || value === undefined) {
                return value;
            }

            if (value instanceof Document) {
                value.$__.wasPopulated = true;
                return value;
            }

            // setting a populated path
            if (value instanceof oid) {
                return value;
            } else if ((value.constructor.name || '').toLowerCase() === 'objectid') {
                return new oid(value.toHexString());
            } else if (Buffer.isBuffer(value) || !utils.isObject(value)) {
                throw new CastError('ObjectId', value, this.path);
            }

            // Handle the case where user directly sets a populated
            // path to a plain object; cast to the Model used in
            // the population query.
            const path = doc.$__fullPath(this.path);
            const owner = doc.ownerDocument ? doc.ownerDocument() : doc;
            const pop = owner.populated(path, true);
            let ret = value;
            if (!doc.$__.populated ||
                !doc.$__.populated[path] ||
                !doc.$__.populated[path].options ||
                !doc.$__.populated[path].options.options ||
                !doc.$__.populated[path].options.options.lean) {
                ret = new pop.options.model(value);
                ret.$__.wasPopulated = true;
            }

            return ret;
        }

        try {
            // console.log(this.constructor.cast()(value))
            return this.constructor.cast()(value);
        } catch (error) {
            // console.log(error)
            return value;
            // throw new CastError('ObjectId', value, this.path);
        }
    };

    return callback();

}