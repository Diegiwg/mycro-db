# MycroDB 📦

[![Logo](/public/logo.png)](https://www.npmjs.com/package/mycro-db)

[![Brazil Flag](/public/brazil.png) Documentation in Portuguese](https://diegiwg.github.io/mycro-db/pt)

## Project Overview 🚀

MycroDB is a JavaScript library designed for managing Document Databases stored in a single JSON file or in memory.

MycroDB is available as an NPM library, and you can find it at [https://www.npmjs.com/package/mycro-db](https://www.npmjs.com/package/mycro-db).

## Example Project

To showcase how MycroDB works, we've developed a sample project that implements a Command Line Interface (CLI) for task management. For more information about this project, please visit its dedicated repository at [Todz](https://github.com/Diegiwg/todz).

## Installation

To integrate MycroDB into your project, you can install it via npm (or other package managers):

```shell
npm install mycro-db
```

## MycroDB API

To get started, import the 'MycroDatabase' class along with a 'Storage' class, and initialize both objects:

```javascript
import { JsonStorage, MemoryStorage, MycroDatabase } from 'mycro-db';

// In-memory mode
const inMemoryStorage = new MemoryStorage();
const db = new MycroDatabase(inMemoryStorage);

// JSON file mode
const jsonStorage = new JsonStorage('my_database.json');
const db = new MycroDatabase(jsonStorage);
```

### Collections API

To maintain organized data, the library employs a collection structure. Utilize collections to logically categorize your data.

#### Define a Collection

To create a collection, you need to provide a name, and optionally, you can include a model (an object with properties and their corresponding data types) to enhance IDE intellisense.

```javascript
const User = db.collection('users', { name: String(), age: Number() });
```

#### Insert a Document into a Collection

To insert a document into a collection, you should supply a plain JavaScript object with values compatible with JSON. You can insert one or more documents in a single operation by passing an array of document objects.

```javascript
User.insert([
    { name: 'Alice', age: 28 },
    { name: 'Bob', age: 30 }
]);
```

#### Update a Document in a Collection

To update a document, provide an object containing the 'id' key with the document's ID to be updated, and the 'data' key containing an object with 'key: value' pairs to be updated in the document. The update is atomic, meaning that only the values provided in the object will be updated, while other values in the document remain unchanged. You can update one or more documents in a single operation by passing an array of document objects.

```javascript
User.update([
    { id: 1, data: { age: 45 } }
]);
```

#### Get a Document in a Collection

To retrieve a document from a collection, provide an ID of the document. You can get one or more documents in a single operation by passing an array of IDs.

```javascript
User.get([
    1, 5
]);
```

#### Query Documents in a Collection

To query documents in a collection, provide a strategy (filter) function. If no filtering function is provided, all documents will be returned. The number of documents returned depends on the 'limit' parameter, and the offset parameter is used for 'pagination'. All parameters are optional. By default, the limit is 25, and the offset is 0.

```javascript
const strategy = (user) => user.age > 21;
const limit = 10;
const offset = 0;

User.query(strategy, limit, offset);
```

#### Remove a Document from a Collection

To remove a document, provide an ID of the document. You can remove one or more documents in a single operation by passing an array of IDs.

```javascript
User.remove([
    1, 5
]);
```

## Built-in Storage Strategies

The library supports the following storage strategies:

### In-Memory

This is the simplest strategy, saving data in memory until the application reloads and all data is erased.

```javascript
import { MemoryStorage } from 'mycro-db';

const storage = new MemoryStorage();
const db = new MycroDatabase(storage);
```

### JSON

This is the most commonly used strategy and is ideal for those requiring flexibility and persistence. You can provide a schema, but it is primarily used as a reference for IDE intellisense.

```javascript
import { JsonStorage } from 'mycro-db';

const storage = new JsonStorage('my_database.json');
const db = new MycroDatabase(storage);
```

### Typed JSON

This strategy offers the same functionality as JSON, but it incorporates a 'Schema' for 'insert' and 'update' functions, ensuring that documents added to the database conform to the expected structure (no extra fields and correct data types). If an extra field or incorrect value is provided, an error is raised.

```javascript
import { TypedJsonStorage } from 'mycro-db';

const storage = new TypedJsonStorage('my_database.json');
const db = new MycroDatabase(storage);

const user = db.collection('users', { name: String(), age: Number() });
// Here, it is defined that a user has Name and Age fields, respectively a String and a Number.
```

## Changes Log

For a detailed history of changes to this project, please refer to the [changes.md](changes.md) file in the root directory.

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
