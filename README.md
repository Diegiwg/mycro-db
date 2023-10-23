# MycroDB 📦

[![Logo](/public/logo.png)](https://www.npmjs.com/package/mycro-db)

## Project Overview 🚀

MycroDB is a JavaScript library for managing Document Databases stored in a single JSON file or in-memory.

## Installation

To use MycroDB in your project, you can install it via npm (or other package managers):

```shell
npm install mycro-db
```

# Example

To use an example application, access the following repository:

[Todz](https://github.com/Diegiwg/todz)

## MycroDB API

To get started, import the 'MycroDatabase' class, along with a 'Storage' class, and initialize the two new objects:

```javascript
import { JsonStorage, MemoryStorage, MycroDatabase } from 'mycro-db';

// in-memory only mode
const inMemoryStorage = new MemoryStorage();
const db = new MycroDatabase(inMemoryStorage);

// json file mode
const jsonStorage = new JsonStorage('my_database.json');
const db = new MycroDatabase(jsonStorage);
```

### Collections API

To keep data organized, the library works with a collections structure. Use collections to 'logically' divide your data.

#### Define a Collection

To create a collection, you must provide a name, and optionally, you can pass a model (use an object with properties and their values being their types) to help the IDE with intellisense.

```javascript
const User = db.collection('users', { name: String(), age: Number() });
```

#### Insert a Document into a Collection

To insert a document into a collection, you need to provide a plain JavaScript object with values compatible with JSON.

You can insert one or more documents in a single operation by passing a array of document objects.

```javascript
User.insert([
    { name: 'Alice', age: 28 },
    { name: 'Bob', age: 30 }
]);
```

#### Update a Document in a Collection

To update a document, you should pass an object containing the 'id' key with the value of the document's ID to be updated, along with the 'data' key containing an object with the 'key: value' pair that will be updated in the document.

The update is atomic, meaning that only the values provided in the object will be updated, while the other values in the document remain unchanged.

You can update one or more documents in a single operation by passing a array of document objects.

```javascript
User.update([
    { id: 1, data: { age: 45 } }
]);
```

#### Get a Document in a Collection

To get a document from a collection, you should provide a ID of the document.

You can get one or more documents in a single operation by passing a array of IDs.

```javascript
User.get([
    1, 5
]);
```

#### Query Documents in a Collection

To query documents in a collection, you should provide a strategy (filter) function. If no filtering function is provided, all documents will be returned.

The quantity of documents returned depends on the 'limit' parameter. Offset parameter is used for 'pagination'.

All parameters are optional. By default, the limit is 25, the offset is 0.

```javascript
const strategy = (user) => user.age > 21;
const limit = 10;
const offset = 0;

User.query(strategy, limit, offset);
```

#### Remove a Document from a Collection

To remove a document, you should provide a ID of the document.

You can remove one or more documents in a single operation by passing a array of IDs.

```javascript
User.remove([
    1, 5
]);
```

## Built-in Storage Strategies

The library supports the following storage strategies:

### In-Memory

This is the simplest strategy, saving the data in memory, until the application reloads and all data is erased.

```javascript
import { MemoryStorage } from 'mycro-db';

const storage = new MemoryStorage();
const db = new MycroDatabase(storage);
```

### JSON

This is the most common to be used, it is for those who need flexibility and persistence.

You can provide a Schema, but it will only be used as a reference for the IDE's Intellisense.

```javascript
import { JsonStorage } from 'mycro-db';

const storage = new JsonStorage('my_database.json');
const db = new MycroDatabase(storage);
```

### Typed JSON

It has the same functionalities as JSON, however, the 'insert' and 'update' functions now use the 'Schema' provided to check whether the documents the user is trying to add to the database are as expected (not has extra fields and all fields have the correct types).

If an extra field, or incorrect value for an existing field in the Schema, is provided, an error is raised.

```javascript
import { TypedJsonStorage } from 'mycro-db';

const storage = new TypedJsonStorage('my_database.json');
const db = new MycroDatabase(storage);

const user = db.collection('users', { name: String(), age: Number() });
// Here, it is defined that a user has the Name and Age fields, and that these are respectively a String and a Number.
```

## Next Steps

We're planning to:

- 🧹 Implement a data caching system and indexing for specific Collection keys.

## Changes Log

For a detailed history of changes to this project, please refer to the [changes.log](changes.log) file in the root directory.

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
