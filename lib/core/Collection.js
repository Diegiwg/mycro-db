/**
 * @template Model
 *
 * @typedef {Object} CollectionRef
 * @property {string} identifier The identifier for the collection.
 * @property {{read: Function, write: Function}} storage The storage object for the collection.
 * @property {{id: number, documents: Object<string, Model>}} memory The memory object for the collection.
 */

/**
 * Checks the validity of a parameter and returns it.
 *
 * @param {any} param The parameter to be checked.
 * @return {Array} The valid parameter.
 */
function checkParam(param) {
    if (param == null || param === undefined) {
        throw new Error("The parameter is required.");
    }

    if (!Array.isArray(param)) {
        param = [param];
    }

    return param;
}

/**
 * Inserts documents into the collection.
 *
 * @template Model
 * @param {CollectionRef<Model>} ref The reference to the collection.
 * @param {Model} schema The schema for the collection.
 */
function insert(ref, schema) {
    /**
     * Inserts documents into the collection.
     *
     * @param  {Model[]} docs The documents to be inserted.
     */
    return (docs) => {
        docs = checkParam(docs);

        const operations = [];

        for (const doc of docs) {
            operations.push(() => {
                const docId = ref.memory.id++;

                doc.id = docId;

                ref.memory.documents[docId] = doc;
            });
        }

        ref.sync(operations);
    };
}

/**
 * Retrieves documents from the collection.
 *
 * @template Model
 * @param {CollectionRef<Model>} ref The reference to the collection.
 * @param {Model} schema The schema for the collection.
 */
function get(ref, schema) {
    /**
     * Retrieves documents from the collection.
     *
     * @param {number[]} ids The ids of the documents to be retrieved.
     */
    return (ids) => {
        ids = checkParam(ids);

        const file = ref.storage.read();

        const docs = [];

        for (const id of ids) {
            if (!ref.memory.documents[id]) continue;

            docs.push(file["collections"][ref.identifier].documents[id]);
        }

        return docs;
    };
}

/**
 * Removes documents from the collection.
 *
 * @template Model
 * @param {CollectionRef<Model>} ref The reference to the collection.
 * @param {Model} schema The schema for the collection.
 */
function remove(ref, schema) {
    /**
     * Removes documents from the collection.
     *
     * @param {number[]} ids The ids of the documents to be removed.
     */
    return (ids) => {
        ids = checkParam(ids);

        const operations = [];

        for (const id of ids) {
            if (!ref.memory.documents[id]) continue;

            operations.push(() => {
                delete ref.memory.documents[id];
            });
        }

        ref.sync(operations);
    };
}

/**
 * Updates documents in the collection.
 *
 * @template Model
 * @param {CollectionRef<Model>} ref The reference to the collection.
 * @param {Model} schema The schema for the collection.
 */
function update(ref, schema) {
    /**
     * Updates documents in the collection.
     *
     * @param {{id: number, data: Model}[]} orders The update orders to be applied.
     */
    return (orders) => {
        orders = checkParam(orders);

        const operations = [];

        for (const order of orders) {
            if (!order.id || !order.data) {
                continue;
            }

            if (!ref.memory.documents[order.id]) {
                continue;
            }

            operations.push(() => {
                for (const key of Object.keys(order.data)) {
                    ref.memory.documents[order.id][key] = order.data[key];
                }
            });
        }

        ref.sync(operations);
    };
}

/**
 * Retrieves documents from the collection using a strategy (filter).
 *
 * @template Model
 * @param {CollectionRef<Model>} ref The reference to the collection.
 * @param {Model} schema The schema for the collection.
 */
function query(ref, schema) {
    /**
     * Retrieves documents from the collection using a strategy (filter).
     *
     * @param {(doc: Model) => boolean} strategy The strategy to be used (optional).
     * @param {number} limit The number of documents to be retrieved (default: 25).
     * @param {number} offset The number of documents to be skipped (for pagination).
     */
    return (strategy = null, limit = 25, offset = 0) => {
        const file = ref.storage.read();
        const docs = file["collections"][ref.identifier].documents;
        const values = Object.values(docs);

        const result = strategy ? values.filter(strategy) : values;
        const limitResult = result.slice(offset, offset + limit);

        return {
            /** @type {Model[]} */
            docs: limitResult,
            offset,
            limit,
        };
    };
}

/**
 * Retrieves the number of documents in the collection.
 *
 * @template Model
 * @param {CollectionRef<Model>} ref The reference to the collection.
 * @param {Model} schema The schema for the collection.
 */
function count(ref, schema) {
    /**
     * Retrieves the number of documents in the collection.
     */
    return () => {
        const file = ref.storage.read();
        return Object.keys(file["collections"][ref.identifier].documents)
            .length;
    };
}

/**
 * Crate a new collection if the identifier does not exist in the storage.
 *
 * @param {CollectionRef<T>} ref The reference to the collection.
 */
function create(ref) {
    const file = ref.storage.read();

    if (!Object.keys(file["collections"]).includes(ref.identifier)) {
        file["collections"][ref.identifier] = ref.memory;
        ref.storage.write(file);
    }
}

/**
 * Synchronizes the collection with the storage.
 *
 * @param {Function[]} operations The operations to be executed.
 */
function sync(ref) {
    /**
     * Synchronizes the collection with the storage.
     *
     * @param {Function[]} operations The operations to be executed.
     */
    return (operations) => {
        operations = checkParam(operations);

        const file = ref.storage.read();
        ref.memory = file["collections"][ref.identifier];

        for (const operation of operations) {
            operation.call(this);
        }

        file["collections"][ref.identifier] = ref.memory;
        ref.storage.write(file);
    };
}

/**
 * Represents a collection of documents.
 *
 * @template Model The type of the documents in the collection.
 * @param {string} identifier The identifier for the collection.
 * @param {object} storage The storage object for the collection.
 * @param {Model} schema The schema for the collection.
 */
export function Collection(identifier, storage, schema) {
    /**
     * @private
     * @type {object}
     * @property {number} id - The current ID for new documents.
     * @property {Model[]} documents - The collection of documents.
     */
    this.memory = {
        id: 1,
        documents: {},
    };

    /**
     * @private
     * @type {string}
     * @description The identifier for the collection.
     */
    this.identifier = identifier;

    /**
     * @private
     * @type {object}
     * @description The storage object for the collection.
     */
    this.storage = storage;

    /** @private */
    this.sync = sync(this);

    /** @public */
    this.insert = insert(this, schema);

    /** @public */
    this.get = get(this, schema);

    /** @public */
    this.remove = remove(this, schema);

    /** @public */
    this.update = update(this, schema);

    /** @public */
    this.query = query(this, schema);

    /** @public */
    this.count = count(this, schema);

    create(this);
}
