import { Collection } from "./Collection.js";

/**
 * @typedef {Object} StoragePlugin
 * @property {Function} read The read function.
 * @property {Function} write The write function.
 */

/**
 * Represents a database.
 */
export class MycroDatabase {
    /** @private */
    storage;

    /**
     * Initializes a new instance of the MycroDatabase class.
     *
     * @param {StoragePlugin} storage The storage plugin to be used. Must include 'read' and 'write' as functions.
     */
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Creates a new collection with the given identifier and schema.
     *
     * @template Model
     * @param {string} identifier The identifier for the collection.
     * @param {Model} schema The schema for the collection.
     */
    collection(identifier, schema = {}) {
        const col = new Collection(identifier, this.storage, schema);
        return col;
    }
}
