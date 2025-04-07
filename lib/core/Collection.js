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
 * @typedef {Object} InsertEventData
 * @property {Model[]} docs The documents that were inserted.
 *
 * @typedef {Object} GetEventData
 * @property {Model[]} docs The documents that were retrieved.
 *
 * @typedef {Object} RemoveEventData
 * @property {number[]} ids The ids of the documents that were removed.
 *
 * @typedef {Object} UpdateEventData
 * @property {number[]} ids The ids of the documents that were updated.
 * @property {Model[]} docs The updated documents.
 *
 * @typedef {Object} QueryEventData
 * @property {number[]} ids The ids of the documents that were retrieved.
 * @property {Model[]} docs The retrieved documents.
 *
 * @typedef {Object} CountEventData
 * @property {number} count The number of documents in the collection.
 *
 * @typedef {Object} EventData
 * @property {import('../types.js').CollectionRef<Model>} ref The reference to the collection.
 * @property {InsertEventData | GetEventData | RemoveEventData | UpdateEventData | QueryEventData | CountEventData} data The data that was emitted.
 */

/**
 * Emits an event to the collection.
 * @param {import('../types.js').CollectionRef<Model>} ref The reference to the collection.
 * @param {import('../types.js').CollectionSchema<Model>} schema The schema for the collection.
 * @param {string} type The type of the event.
 * @param {EventData} data The data that was emitted.
 */
function event(ref, schema, type, data) {
    const callbacks = Object.keys(ref.events[type]);

    for (const callbackId of callbacks) {
        const callback = ref.events[type][callbackId];

        callback({
            ref: ref,
            data: data,
        });
    }
}

/**
 * Inserts documents into the collection.
 *
 * @template Model
 * @param {import('../types.js').CollectionRef<Model>} ref The reference to the collection.
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

        event(ref, schema, "onInsert", { docs });

        ref.sync(operations);
    };
}

/**
 * Retrieves documents from the collection.
 *
 * @template Model
 * @param {import('../types.js').CollectionRef<Model>} ref The reference to the collection.
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
        ref.memory = file["collections"][ref.identifier];

        const docs = [];
        for (const id of ids) {
            if (!ref.memory.documents[id]) continue;

            docs.push(file["collections"][ref.identifier].documents[id]);
        }

        event(ref, schema, "onGet", { docs });

        return docs;
    };
}

/**
 * Removes documents from the collection.
 *
 * @template Model
 * @param {import('../types.js').CollectionRef<Model>} ref The reference to the collection.
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

        const file = ref.storage.read();
        ref.memory = file["collections"][ref.identifier];

        const operations = [];
        for (const id of ids) {
            if (!ref.memory.documents[id]) continue;

            operations.push(() => {
                delete ref.memory.documents[id];
            });
        }

        event(ref, schema, "onRemove", { ids });

        ref.sync(operations);
    };
}

/**
 * Updates documents in the collection.
 *
 * @template Model
 * @param {import('../types.js').CollectionRef<Model>} ref The reference to the collection.
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

        const file = ref.storage.read();
        ref.memory = file["collections"][ref.identifier];

        const operations = [];
        const eventData = { ids: [], docs: [] };

        for (const order of orders) {
            if (!order.id || !order.data) {
                continue;
            }

            if (!ref.memory.documents[order.id]) {
                continue;
            }

            operations.push(() => {
                eventData.ids.push(order.id);

                for (const key of Object.keys(order.data)) {
                    ref.memory.documents[order.id][key] = order.data[key];
                }

                eventData.docs.push(ref.memory.documents[order.id]);
            });
        }

        event(ref, schema, "onUpdate", eventData);

        ref.sync(operations);
    };
}

/**
 * Retrieves documents from the collection using a strategy (filter).
 *
 * @template Model
 * @param {import('../types.js').CollectionRef<Model>} ref The reference to the collection.
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

        event(ref, schema, "onQuery", {
            ids: result.map((doc) => doc.id),
            docs: limitResult,
        });

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
 * @param {import('../types.js').CollectionRef<Model>} ref The reference to the collection.
 * @param {Model} schema The schema for the collection.
 */
function count(ref, schema) {
    /**
     * Retrieves the number of documents in the collection.
     */
    return () => {
        const file = ref.storage.read();
        const count = Object.keys(
            file["collections"][ref.identifier].documents
        ).length;

        event(ref, schema, "onCount", { count });

        return count;
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

function listenEvent(ref, schema, eventType) {
    return (callback) => {
        checkParam(callback);

        const callbackId = Math.random().toString(36).substring(2, 15);
        ref.events[eventType][callbackId] = callback;

        return callbackId;
    };
}

function removeEvent(ref, schema, eventType) {
    return (callbackId) => {
        const eventCallbackId = checkParam(callbackId);

        if (!ref.events[eventType][eventCallbackId]) {
            throw new Error(`Invalid callback id: ${eventCallbackId}`);
        }

        delete ref.events[eventType][eventCallbackId];
    };
}

export const DEFAULT_FUNCTIONS = {
    insert,
    get,
    remove,
    update,
    query,
    count,
    create,
    sync,

    // Events
    listenEvent,
    removeEvent,

    // Utils
    checkParam,
};

/**
 * Represents a collection of documents.
 *
 * @template Model The type of the documents in the collection.
 * @param {string} identifier The identifier for the collection.
 * @param {import('../types.js').StoragePlugin} storage The storage object for the collection.
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
     * @type {import('../types.js').StoragePlugin}
     */
    this.storage = storage;

    this.events = {
        onInsert: {},
        onGet: {},
        onRemove: {},
        onUpdate: {},
        onQuery: {},
        onCount: {},
    };

    /**
     * @public
     * Listens to the event of inserting documents into the collection.
     * @type {(callback: (event: EventData) => void) => string}
     * @param {(event: EventData) => void} callback The callback function to be called when the event is triggered.
     */
    this.onInsert = listenEvent(this, schema, "onInsert");

    /**
     * @public
     * Listens to the event of retrieving documents from the collection.
     * @type {(callback: (event: GetEventData) => void) => string}
     * @param {(event: GetEventData) => void} callback The callback function to be called when the event is triggered.
     */
    this.onGet = listenEvent(this, schema, "onGet");

    /**
     * @public
     * Listens to the event of removing documents from the collection.
     * @type {(callback: (event: RemoveEventData) => void) => string}
     * @param {(event: RemoveEventData) => void} callback The callback function to be called when the event is triggered.
     */
    this.onRemove = listenEvent(this, schema, "onRemove");

    /**
     * @public
     * Listens to the event of updating documents in the collection.
     * @type {(callback: (event: UpdateEventData) => void) => string}
     * @param {(event: UpdateEventData) => void} callback The callback function to be called when the event is triggered.
     */
    this.onUpdate = listenEvent(this, schema, "onUpdate");

    /**
     * @public
     * Listens to the event of retrieving documents from the collection using a strategy (filter).
     * @type {(callback: (event: QueryEventData) => void) => string}
     * @param {(event: QueryEventData) => void} callback The callback function to be called when the event is triggered.
     */
    this.onQuery = listenEvent(this, schema, "onQuery");

    /**
     * @public
     * Listens to the event of retrieving the number of documents in the collection.
     * @type {(callback: (event: QueryEventData) => void) => string}
     * @param {(event: CountEventData) => void} callback The callback function to be called when the event is triggered.
     */
    this.onCount = listenEvent(this, schema, "onCount");

    /**
     * @private
     */
    this.sync = storage.sync ? storage.sync(this, schema) : sync(this);

    /**
     * @public
     * Inserts documents into the collection.
     * @type {(docs: Model[]) => void}
     * @param {Model[]} docs The documents to be inserted.
     */
    this.insert = storage.insert
        ? storage.insert(this, schema)
        : insert(this, schema);

    /**
     * @public
     * Retrieves documents from the collection.
     * @type {(number[]) => Model[]}
     * @param {number[]} ids The ids of the documents to be retrieved.
     */
    this.get = storage.get ? storage.get(this, schema) : get(this, schema);

    /**
     * @public
     * Removes documents from the collection.
     * @type {(number[]) => void}
     * @param {number[]} ids The ids of the documents to be removed.
     */
    this.remove = storage.remove
        ? storage.remove(this, schema)
        : remove(this, schema);

    /**
     * @public
     * Updates documents in the collection.
     * @param {number[]} ids The ids of the documents to be updated.
     * @param {{id: number, data: Model}[]} orders The update orders to be applied.
     */
    this.update = storage.update
        ? storage.update(this, schema)
        : update(this, schema);

    /**
     * @public
     * Retrieves documents from the collection using a strategy (filter).
     * @type {(strategy?: (doc: Model) => boolean, limit?: number, offset?: number) => {docs: Model[]; offset: number; limit: number;}}
     * @param {(doc: Model) => boolean} strategy The strategy to be used (optional).
     * @param {number} limit The number of documents to be retrieved (default: 25).
     * @param {number} offset The number of documents to be skipped (for pagination).
     */
    this.query = storage.query
        ? storage.query(this, schema)
        : query(this, schema);

    /**
     * @public
     * Retrieves the number of documents in the collection.
     * @type {() => number}
     */
    this.count = storage.count
        ? storage.count(this, schema)
        : count(this, schema);

    /**
     * @private
     */
    storage.create ? storage.create(this, schema) : create(this, schema);
}
