import fs from "fs";

export class MycroDatabase {
    /**
     * @type {string}
     * @private
     * @readonly
     */
    __filePath;

    /**
     * @type {object}
     * @private
     * @readonly
     */
    __memory = {};

    /**
     * @type {number}
     * @private
     * @readonly
     */
    __id;

    __load() {
        const content = fs.readFileSync(this.__filePath, "utf-8");
        const object = JSON.parse(content);

        this.__memory = object.memory || {};
        this.__id = Number(object.id) || 0;
    }

    __save() {
        fs.writeFileSync(
            this.__filePath,
            JSON.stringify({
                memory: this.__memory,
                id: this.__id,
            })
        );
    }

    __nextId() {
        if (!this.__id) {
            this.__id = 1;
        }

        return this.__id++;
    }

    /**
     * @param {string} filePath
     */
    constructor(filePath) {
        if (!filePath) {
            throw new Error("filePath is required");
        }

        this.__filePath = filePath;

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "{}");
        }

        this.__load();
    }

    /**
     * Save the current state of the database to disk.
     */
    sync() {
        this.__save();
    }

    /**
     * @template Document
     *
     * @param {string} identifier
     * @param {Document} schema
     */
    collection(identifier, schema) {
        /**
         * @param {Document} doc
         */
        const insert = (doc) => {
            const id = this.__nextId();

            doc["id"] = id;
            this.__memory[id] = doc;
        };

        /**
         * @param {*} filter
         * @returns {Document[]}
         */
        const query = (filter) => {
            const values = Object.values(this.__memory);

            if (!filter) {
                return values;
            }

            return values.filter(filter);
        };

        return {
            insert,
            query,
        };
    }
}
