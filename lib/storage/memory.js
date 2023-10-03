export class MemoryStorage {
    /** @private */
    memory;

    /**
     * A Storage utility for operations that do not require data persistence.
     */
    constructor() {
        this.memory = { collections: {} };
    }

    read() {
        return this.memory;
    }

    write(data) {
        this.memory = data;
    }
}
