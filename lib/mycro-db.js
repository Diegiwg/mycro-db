import fs from "fs";

export class MycroDatabase {
    /**
     * @private
     * @type {string}
     */
    __filePath;

    /**
     * @private
     * @type {Object<string, {documents: Array, id: number}>}
     */
    __memory = {};

    /**
     * @private
     */
    __collections = {};

    /**
     * @private
     */
    __load() {
        let object;

        if (this.__filePath) {
            const content = fs.readFileSync(this.__filePath, "utf-8");
            object = JSON.parse(content);
        }

        this.__memory = object?.memory || {};
        this.__collections = object?.collections || {};
    }

    /**
     * @private
     */
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
     * @private
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
     * Creates a new MycroDatabase instance.
     *
     * If the filePath is not provided, the database will be in memory only mode.
     *
     * @param {string} filePath The path to the database file.
     */
    constructor(filePath = null) {
        this.__filePath = filePath;

        if (filePath && !fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "{}");
        }

        this.__load();
    }

    /**
     * Save the current state of the database to disk.
     *
     * An error if the database is in memory only mode.
     */
    sync() {
        if (!this.__filePath) {
            throw new Error("Database in Memory only mode");
        }

        this.__save();
    }

    /**
     * Represents a collection of documents.
     *
     * An error if the identifier is not provided.
     *
     * @template Document
     *
     * @param {string} identifier The identifier of the collection.
     * @param {Document} schema The schema of the documents in the collection.
     */
    collection(identifier, schema = {}) {
        if (!identifier) {
            throw new Error("Identifier is must be provided.");
        }

        if (!this.__collections[identifier]) {
            this.__memory[identifier] = {
                documents: {},
                id: 1,
            };

            this.__collections[identifier] = true;
        }

        /**
         * Inserts a document(s) into the collection.
         *
         * An error if the document(s) is not provided.
         *
         * @param {...Document} doc The document(s) to insert.
         *
         * @returns {number[]} The id(s) of the document(s).
         */
        const insert = (...docs) => {
            if (!docs || docs == null) {
                throw new Error("Document(s) is must be provided.");
            }

            const ids = [];
            for (const doc of docs) {
                const id = this.__nextId(identifier);

                doc["id"] = id;

                this.__memory[identifier].documents[id] = doc;

                ids.push(id);
            }

            return ids;
        };

        /**
         * Queries the collection for all documents, or that match the filter.
         *
         * An error if the filter is not a function.
         *
         * @param {(doc: Document) => boolean} filter The filter to apply (optional).
         *
         * @returns {Document[]} An array of documents.
         */
        const query = (filter = null) => {
            if (filter && typeof filter !== "function") {
                throw new Error("Filter must be a function.");
            }

            const values = Object.values(this.__memory[identifier].documents);

            if (!filter) {
                return values;
            }

            return values.filter(filter);
        };

        /**
         * Removes documents from the collection.
         *
         * An error if the filter is not provided, or if the filter is not a function.
         *
         * @param {(doc: Document) => boolean} filter The filter to apply.
         *
         * @returns {number[]} An array of ids of the removed documents.
         */
        const remove = (filter) => {
            if (!filter) {
                throw new Error("Filter is required.");
            }

            if (typeof filter !== "function") {
                throw new Error("Filter must be a function.");
            }

            const docs =
                Object.values(this.__memory[identifier].documents).filter(
                    filter
                ) || [];

            const ids = [];
            for (const doc of docs) {
                ids.push(doc.id);
                delete this.__memory[identifier].documents[doc.id];
            }

            return ids;
        };

        /**
         * Updates a document in the collection.
         *
         * An error if the filter is not provided, or if the filter is not a function.
         *
         * An error if the data is not provided.
         *
         * @param {(doc: Document) => boolean} filter The filter to apply.
         * @param {Document} data The data to update the document with.
         *
         * @returns {number[]} An array of ids of the updated documents.
         */
        const update = (filter, data) => {
            if (!filter) {
                throw new Error("Filter is required.");
            }

            if (typeof filter !== "function") {
                throw new Error("Filter must be a function.");
            }

            if (!data) {
                throw new Error("Data is required.");
            }

            const docs =
                Object.values(this.__memory[identifier].documents).filter(
                    filter
                ) || [];

            const keys = Object.keys(data);

            const ids = [];
            for (const doc of docs) {
                for (const key of keys) {
                    this.__memory[identifier].documents[doc.id][key] =
                        data[key];
                }

                ids.push(doc.id);
            }

            return ids;
        };

        const collection = {
            insert,
            query,
            remove,
            update,
        };

        return collection;
    }
}
