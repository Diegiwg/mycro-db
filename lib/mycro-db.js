import fs from "fs";

export class MycroDatabase {
    /**
     * @private
     * @readonly
     * @type {string}
     */
    __filePath;

    /**
     * @private
     * @readonly
     * @type {Object<string, {documents: Array, id: number}>}
     */
    __memory = {};

    /**
     * @private
     * @readonly
     */
    __collections = {};

    __load() {
        const content = fs.readFileSync(this.__filePath, "utf-8");
        const object = JSON.parse(content);

        this.__memory = object.memory || {};
        this.__collections = object.collections || {};
    }

    __save() {
        fs.writeFileSync(
            this.__filePath,
            JSON.stringify({
                memory: this.__memory,
                collections: this.__collections,
            })
        );
    }

    /**
     * @param {string} collection
     * @return {number}
     */
    __nextId(collection) {
        if (!collection) {
            throw new Error("collection is required");
        }

        if (!this.__collections[collection]) {
            throw new Error("collection does not exist");
        }

        return this.__memory[collection].id++;
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

        if (!this.__collections[identifier]) {
            this.__memory[identifier] = {
                documents: {},
                id: 1,
            };

            this.__collections[identifier] = true;
        }

        /**
         * Inserts a document into the collection.
         *
         * @param {Document} doc - The document to insert.
         */
        const insert = (doc) => {
            const id = this.__nextId(identifier);

            doc["id"] = id;

            this.__memory[identifier].documents[id] = doc;
        };

        /**
         * Queries the collection for documents that match the filter.
         *
         * @param {(doc: Document) => boolean} filter - The filter to apply.
         * @returns {Document[]} - An array of documents that match the filter.
         */
        const query = (filter) => {
            const values = Object.values(this.__memory[identifier].documents);

            if (!filter) {
                return values;
            }

            return values.filter(filter);
        };

        const collection = {
            insert,
            query,
        };

        return collection;
    }
}
