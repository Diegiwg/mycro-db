/**
 * @typedef StoragePlugin
 * @property {Function?} count - The count function.
 * @property {Function?} create - The create function.
 * @property {Function?} get - The get function.
 * @property {Function?} insert - The insert function.
 * @property {Function?} query - The query function.
 * @property {Function} read - The read function.
 * @property {Function?} remove - The remove function.
 * @property {Function?} sync - The sync function.
 * @property {Function?} update - The update function.
 * @property {Function} write - The write function.
 */

/**
 * @template Model The type of the documents in the collection
 *
 * Represents a collection of documents
 * @typedef CollectionRef
 * @property {string} identifier The identifier for the collection.
 * @property {StoragePlugin} storage The storage object for the collection.
 * @property {{id: number, documents: Object<string, Model>}} memory The memory object for the collection.
 */

export const _ = "";
