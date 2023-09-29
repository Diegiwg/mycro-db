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
     * @param {string|null} filePath - The path to the database file.
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
     * @throws {Error} - An error if the database is in memory only mode.
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
     * @template Document
     *
     * @param {string} identifier - The identifier of the collection.
     * @param {Document} schema - The schema of the documents in the collection.
     *
     * @throws {Error} - An error if the identifier is not provided.
     * @throws {Error} - An error if the schema is not provided.
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

        /**
         * Removes documents from the collection.
         *
         * @param {(doc: Document) => boolean} filter - The filter to apply.
         *
         * @throws {Error} - An error if the filter is not provided.
         */
        const remove = (filter) => {
            const values = Object.values(this.__memory[identifier].documents);

            if (!filter) {
                return new Error("filter is required");
            }

            const docs = values.filter(filter);

            docs.forEach((doc) => {
                delete this.__memory[identifier].documents[doc.id];
            });
        };

        /**
         * Updates a document in the collection.
         *
         * @param {(doc: Document) => boolean} filter - The filter to apply.
         * @param {Document} data - The data to update the document with.
         *
         * @throws {Error} - An error if the filter is not provided.
         * @throws {Error} - An error if the data is not provided.
         */
        const update = (filter, data) => {
            const values = Object.values(this.__memory[identifier].documents);

            if (!filter) {
                return new Error("filter is required");
            }

            if (!data) {
                return new Error("data is required");
            }

            const docs = values.filter(filter);

            docs.forEach((doc) => {
                const keys = Object.keys(data);

                keys.forEach((key) => {
                    doc[key] = data[key];
                });

                this.__memory[identifier].documents[doc.id] = doc;
            });
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
