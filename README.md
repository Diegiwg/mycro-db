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

// Create a new MycroDatabase instance that exists only in memory
const db_only_in_memory = new MycroDatabase();
```

#### Collections API

##### Define a Collection

To define a collection, provide a name and a schema (a plain JavaScript object) that describes the structure of documents in that collection. This enables IDE auto-completion (intellisense) for users.

```javascript
const User = db.collection('users', { id: Number(), name: String(), age: Number() });
```

##### Insert a Document into a Collection

```javascript
User.insert({ name: 'Alice', age: 28 });
```

**Explanation:** The `insert` method allows you to add a new document to the collection. In this example, we're inserting a user with a name and age.

##### Update a Document in a Collection

```javascript
User.update((doc) => doc.id === 0, { age: 45 });
```

**Explanation:** The `update` method allows you to modify documents in the collection based on a condition. In this example, we're updating the age of a user whose ID is 0 to 45.

##### Query Documents in a Collection

```javascript
const youngUsers = User.query((user) => user.age < 30);
console.log(youngUsers);
```

**Explanation:** The `query` method lets you retrieve documents from the collection based on a filter condition. Here, we're getting all users with an age less than 30.

##### Remove a Document from a Collection

```javascript
User.remove((doc) => doc.id === 0);
```

**Explanation:** The `remove` method allows you to delete documents from the collection based on a condition. In this example, we're removing a user with ID 0 from the collection.

#### Sync

```javascript
// Synchronize data to the disk
db.sync();
```

**Explanation:** The `sync` method ensures that the changes made in memory are saved to the disk. It's important to call `sync` to persist data.

## Changes Log

For a detailed history of changes to this project, please refer to the [changes.log](changes.log) file in the root directory.

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
