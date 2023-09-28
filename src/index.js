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

    /**
     * @private
     * @readonly
     */
    __collections = {};

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
     * Represents a collection of documents.
     *
     * @template Document
     * @param {string} identifier - The identifier of the collection.
     * @param {Document} schema - The schema of the documents in the collection.
     */
    collection(identifier, schema) {
        if (!identifier) {
            throw new Error("identifier is required");
        }

        if (!schema) {
            throw new Error("schema is required");
        }

        /**
         * Inserts a document into the collection.
         *
         * @param {Document} doc - The document to insert.
         */
        const insert = (doc) => {
            const id = this.__nextId();

            doc["id"] = id;
            this.__memory[id] = doc;
        };

        /**
         * Queries the collection for documents that match the filter.
         *
         * @param {(doc: Document) => boolean} filter - The filter to apply.
         * @returns {Document[]} - An array of documents that match the filter.
         */
        const query = (filter) => {
            const values = Object.values(this.__memory);

            if (!filter) {
                return values;
            }

            return values.filter(filter);
        };

        const collection = {
            insert,
            query,
        };

        if (!this.__collections[identifier]) {
            this.__collections[identifier] = collection;
        }

        return collection;
    }
}
