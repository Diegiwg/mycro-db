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
import MycroDatabase from 'mycro-db';

// Create a new MycroDatabase instance with a path to your JSON file
const db = new MycroDatabase('my_database.json');
```

#### Insert

```javascript
// Insert a new document
const newDoc = { name: 'Alice', age: 28 };
db.insert(newDoc);
```

#### Query

```javascript
// Query documents based on a filter
const youngUsers = db.query((user) => user.age < 30);
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
