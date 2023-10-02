/**
 * @template Model
 *
 * @param {Model} schema
 */
function insert(ref, schema) {
    /**
     * @param  {Model[]} docs
     */
    return (...docs) => {
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
 * @template Model
 *
 * @param {Model} schema
 */
function get(ref, schema) {
    /**
     * @param {number[]} ids
     */
    return (...ids) => {
        const file = ref.storage.read();

        const docs = [];
        for (const id of ids) {
            docs.push(file["collections"][ref.identifier].documents[id]);
        }

        return docs;
    };
}

/**
 * @template Model
 *
 * @param {Model} schema
 */
function remove(ref, schema) {
    /**
     * @param {number[]} ids
     */
    return (...ids) => {
        const operations = [];
        for (const id of ids) {
            operations.push(() => {
                delete ref.memory.documents[id];
            });
        }
        ref.sync(operations);
    };
}

/**
 * @template Model
 *
 * @param {Model} schema
 */
function update(ref, schema) {
    /**
     * @param {{id: number, data: Model}[]} orders
     */
    return (...orders) => {
        const operations = [];
        for (const order of orders) {
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
 * @template Model
 *
 * @param {Model} schema
 */
function query(ref, schema) {
    /**
     * @param {(doc: Model) => boolean} strategy
     */
    return (strategy) => {
        const file = ref.storage.read();
        const docs = file["collections"][ref.identifier].documents;

        const result = Object.values(docs).filter(strategy);

        return {
            count: result.length,
            docs: result,
        };
    };
}

function create(ref) {
    const file = ref.storage.read();

    if (!Object.keys(file["collections"]).includes(ref.identifier)) {
        file["collections"][ref.identifier] = ref.memory;
        ref.storage.write(file);
    }
}

function sync(ref) {
    /**
     * @param {Function[]} operations
     */
    return (operations) => {
        const file = ref.storage.read();
        ref.memory = file["collections"][ref.identifier];

        if (!Array.isArray(operations)) {
            operations = [operations];
        }

        for (const operation of operations) {
            operation.call(this);
        }

        file["collections"][ref.identifier] = ref.memory;
        ref.storage.write(file);
    };
}

/**
 * @template Model
 *
 * @param {string} identifier
 * @param {object} storage
 * @param {Model} schema
 */
export function Collection(identifier, storage = null, schema) {
    /** @private */
    this.memory = {
        id: 1,
        documents: {},
    };

    /** @private */
    this.identifier = identifier;

    /** @private */
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

    create(this);
}
