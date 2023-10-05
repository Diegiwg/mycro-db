import fs from "fs";

import { DEFAULT_FUNCTIONS } from "../core/Collection.js";
import { createDirectoriesRecursively } from "../utils/createDirectoriesRecursively.js";
import { removeFileNameAndExtension } from "../utils/removeFileNameAndExtension.js";
import { validateSchema } from "../utils/validateSchema.js";

export class TypedJsonStorage {
    filePath;

    /**
     * A storage for operations that require data persistence and maintain a JSON file structure.
     * Also has a built-in type checker, for the schema of the collections.
     *
     * @param {string} filePath Path to the file where the data will be stored.
     */
    constructor(filePath) {
        this.filePath = filePath;

        this.bootstrap();
    }

    /** @private */
    bootstrap() {
        const dirPath = removeFileNameAndExtension(this.filePath);
        createDirectoriesRecursively(dirPath);

        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '{"collections": {}}');
        }
    }

    /** @public */
    read() {
        return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    }

    /** @public */
    write(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data));
    }

    // Using the Extended Storage API for type checking

    /**
     * Inserts documents into the collection.
     *
     * @template Model
     * @param {import('../types.js').CollectionRef<Model>} ref The reference to the collection.
     * @param {Model} schema The schema for the collection.
     */
    insert(ref, schema) {
        /**
         * Inserts documents into the collection.
         *
         * @param  {Model[]} docs The documents to be inserted.
         */
        return (docs) => {
            docs = DEFAULT_FUNCTIONS.checkParam(docs);

            for (let i = 0; i < docs.length; i++) {
                docs[i] = validateSchema(schema, docs[i]);
            }

            // Call the default function after checking the schema
            DEFAULT_FUNCTIONS.insert(ref, schema)(docs);
        };
    }

    /**
     * Updates documents in the collection.
     *
     * @template Model
     * @param {import('../types.js').CollectionRef<Model>} ref The reference to the collection.
     * @param {Model} schema The schema for the collection.
     */
    update(ref, schema) {
        /**
         * Updates documents in the collection.
         *
         * @param {{id: number, data: Model}[]} orders The update orders to be applied.
         */
        return (orders) => {
            orders = DEFAULT_FUNCTIONS.checkParam(orders);

            for (let i = 0; i < orders.length; i++) {
                orders[i].data = validateSchema(schema, orders[i].data);
            }

            // Call the default function after checking the schema
            DEFAULT_FUNCTIONS.update(ref, schema)(orders);
        };
    }
}
