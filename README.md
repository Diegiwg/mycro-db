# MycroDB 📦

## Project Overview 🚀

MycroDB is a JavaScript library for managing Document Databases stored in a single JSON file.

## Project Status 🛠️

MycroDB is currently under active development. Stay tuned for updates as we build and refine this exciting new library!

## Installation

To use MycroDB in your project, you can install it via npm or yarn:

```shell
npm install mycro-db
# or
yarn add mycro-db
```

## Usage

### MycroDB API

#### Constructor

```javascript
import { MycroDatabase } from 'mycro-db';

// Create a new MycroDatabase instance with a path to your JSON file
const db = new MycroDatabase('my_database.json');
```

#### Collections API

Starting from version 0.1.0, MycroDB introduces a Collections API for more structured data management.

##### Define a Collection

To define a collection, provide a name and a schema (a plain JavaScript object) that describes the structure of documents in that collection. This enables IDE auto-completion (intellisense) for users.

```javascript
const User = db.collection('users', { id: 0, name: '', age: 0 });
```

##### Insert into a Collection

To insert a document into a collection, use the `insert` method provided by the collection:

```javascript
User.insert({ name: 'Alice', age: 28 });
```

##### Query a Collection

To query documents in a collection, use the `query` method provided by the collection and pass a filter function:

```javascript
const youngUsers = User.query((user) => user.age < 30);
console.log(youngUsers);
```

#### Sync

```javascript
// Synchronize data to the disk
db.sync();
```

## Changes Log

For a detailed history of changes to this project, please refer to the [changes.log](changes.log) file in the root directory.

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
