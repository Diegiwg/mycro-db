# MycroDB 📦

[![Logo](logo.png)](https://www.npmjs.com/package/mycro-db)

## Project Overview 🚀

MycroDB is a JavaScript library for managing Document Databases stored in a single JSON file or in-memory.

## Installation

To use MycroDB in your project, you can install it via npm (or other package managers):

```shell
npm install mycro-db
```

## MycroDB API

To get started, import the 'MycroDatabase' class and instantiate a new object:

```javascript
import { MycroDatabase } from 'mycro-db';

// in-memory only mode
const db = new MycroDatabase();

// disk mode
const db = new MycroDatabase('my_database.json');
```

### Sync

The sync method ensures that the changes made in memory are saved to the disk. It's important to call sync to persist data.

For notes, if you call sync in a database with in-memory mode enable, a error will be thrown.

```javascript
db.sync();
```

### Collections API

To keep data organized, the library works with a collections structure. Use collections to 'logically' divide your data.

#### Define a Collection

To create a collection, you must provide a name, and optionally, you can pass a model (use an object with properties and their values being their types) to help the IDE with intellisense.

```javascript
// Returns a reference to the collection
const User = db.collection('users', { name: String(), age: Number() });
```

#### Insert a Document into a Collection

To insert a document into a collection, you need to provide a plain JavaScript object with values compatible with JSON.

You can insert one or more documents in a single operation by separating each one as an argument (do not pass an array).

```javascript
// Returns a list of IDs of the inserted documents
User.insert({ name: 'Alice', age: 28 }, { name: 'Bob', age: 30 });
```

#### Update a Document in a Collection

To update a document, you should provide a filtering function along with an object containing the new values.

The update is atomic, meaning that only the values provided in the object will be updated, while the other values in the document remain unchanged.

```javascript
// Returns a list containing the ID of updated document
User.update((doc) => doc.id === 1, { age: 45 });
```

#### Update Multiple Documents in a Collection

To update multiple documents, you should provide a filtering function along with a object containing the new values.

The update is atomic, meaning that only the values provided in the object will be updated, while the other values in the documents remain unchanged.

```javascript
// Returns a list containing the IDs of updated documents
User.update((doc) => doc.id === 1 || doc.id === 2, { age: 35 });
```

#### Query Documents in a Collection

To query documents in a collection, you should provide a filtering function. If no filtering function is provided, all documents will be returned.

```javascript
// Returns a list of documents
User.query((user) => user.age > 21);
```

#### Remove a Document from a Collection

To remove a document, you should provide a filtering function.

```javascript
// Returns a list containing the ID of the removed document
User.remove((doc) => doc.id === 0);
```

#### Remove Multiple Documents from a Collection

To remove multiple documents, you should provide a filtering function.

```javascript
// Returns a list containing the IDs of the removed documents
User.remove((doc) => doc.age > 21 && doc.age < 60);
```

## Changes Log

For a detailed history of changes to this project, please refer to the [changes.log](changes.log) file in the root directory.

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
