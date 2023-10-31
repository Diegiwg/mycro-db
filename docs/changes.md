# Version Tracking File

## v1.2.5

    - Fixed bug related to synchronization between disk and memory.

## v1.2.4

    - Fixed the logo link in the Portuguese documentation.
    - Released the version with the fix on npm.

## v1.2.3

    - Added a category for Portuguese documentation to the GitHub page.
    - A link to this documentation has been added to the README.

## v1.2.2

    - Fixed a bug in the generics system that ensures intellisense in collections.
    - Modified the file structure of changes.

## v1.2.1

    - Updated the README for add a reference to the new Storage Strategy (TypedJson).

## v1.2.0

    - Added new Storage model: TypedJson.
    - Characteristics:
            Now, when a schema exists, all inserted/updated data is checked.
            If the type of a data or a key that does not exist in the schema is provided in the Document, an error will be raised.
            Complex cases were tested, such as: { value: [ { key: String(), xxx: [ Number() ] } ], required: Boolean() }.
        - Given this example, at run time, each document will be tested, looking for the following requirements:
        - required: if it exists in the past Document, it must be a boolean.
        - value: if it exists in the document, it must be an array.
                        Each value within this array must be an object:
                            - key: if it exists in the object, it must be a string.
                            - xxx: if it exists in the object, it must be an array of Numbers.
            Several cases were tested, and 'apparently' the validation function '(utils/validateSchema.js)' is working correctly.

## v1.1.1

    - Fixed the npmignore file.

## v1.1.0

    - The Storage API has been enhanced with the option to override the functions available in the Collection API.
        - This primarily aims to enable more complex methods in more intricate Storages.

## v1.0.1

    - Fixed the npmignore file.

## v1.0.0

    - Rework of the entire API.
    - The library has been divided into several modules.
    - Core
        - MycroDatabase: The main class of the library, used to build the database access wrapper.
        - Collection: A class that represents a collection and provides access to its manipulation methods.
    - Storage:
        - Memory: A class that represents an in-memory database.
        - JSON: A class that represents a disk-based database in JSON format.

## v0.4.1

    - Added a 'static site' using the Github Pages.

## v0.4.0

    - Removed the old build script.
        - 'insert' now accepts multiple documents, making it simpler to insert multiple documents at once.
            - Example: `db.collection('users', {id: 0, name: "", age: 0}).insert([{name: "John Doe", age: 20}, {name: "Jane Doe, age: 30}])`
        - 'insert', 'update', and 'remove' now return the list of IDs related to the affected documents (created, modified, and removed).
        - General improvements in argument validations for functions.
        - Updated tests to reflect the changes.
        - README documentation updated.

## v0.3.2

    - Re-added the 'project overview' label in the README.

## v0.3.1

    - Added a Logo in the README.

## v0.3.0

    - Added Remove and Update methods to the Collections API.
    - Complete rewrite of the library's tests.
        - Each function is in its own file.
    - README has been updated to reflect the new changes.

## v0.2.2

    - Removed all Rollup build tooling.
        - The library is 'self-contained' and does not require a separate build process (for now).
    - Updated the package.json to reflect the changes.

## v0.2.1

    - Fixed a minor 'import' example error in the README.
        - Old: import MycroDatabase from 'mycro-db'
        - New: import { MycroDatabase } from 'mycro-db

## v0.2.0

    - The collections system is now stable.
        - When you create a collection, it has its own in-memory space to save its objects.
        - Objects are still indexed using auto-generated IDs.
        - All collection-related information is also saved to disk.
    - No changes were made to the APIs, which still include Insert and Query for each collection, and Sync for the database.
    - Tests have been updated to reflect the changes.

## v0.1.3

    - Modified the type of the 'filter' parameter in db.collection.query.
        - Now, the IDE can provide 'intellisense' for the 'doc' that exists inside the collection.
            - Example: db.collection('users', {id: 0, name: "", age: 0}).query((doc) => doc.name === "John Doe")
            - The IDE knows that 'doc' is of type {id: number, name: string, age: number}.

## v0.1.2

    - When defining a collection, it now checks if the required arguments are being passed for collection creation.
    - There is no type checking on these arguments.
    - The implementation of 'saving collection schemas' to the on-disk database has begun.

## v0.1.1

    - Update README to reflect API changes.

## v0.1.0

    - Implemented the initial version of the Collections API.
    - Removed direct access to Insert and Query.
    - When defining a Collection, you should now pass (with a plain JavaScript object) what you want to be the Schema for that collection.
        - Example: db.collection('users', {id: 0, name: "", age: 0})
            - This will ensure that when users access the Insert and Query methods using the collection, the IDE will know that the 'Document' in this collection has the type: {id: number, name: string, age: number}, and provide auto-completion (intellisense) for the user.
    - To use Insert and Query, you should first create a collection.
        - Example: const User = db.collection('users', {id: 0, name: "", age: 0})
            - User.insert({name: "John Doe", age: 20})
            - User.query((doc) => doc.name === "John Doe")
    - Sync remains at the database level.
        - Example: db.sync()
    - Tests have been modified in accordance with the above changes.

## v0.0.5

    - Added the Rollup package with some plugins for the project compilation process.
    - Modified the package.json to fix the library import issue in other projects.

## v0.0.4

    - Revamped the project README to include the current MycroDB API information.
    - Added the LICENSE file.

## v0.0.3

    - Added the .npmignore file to prevent unnecessary files from being included with the library during packaging.

## v0.0.2

    - Added the 'ava' package as a development dependency for testing.
    - Implemented the initial approach for the Database.
    - The library exports the 'MycroDatabase' class.
    - When constructing this class, it takes a path to the JSON file.
    - An object with 'Insert,' 'Query,' and 'Sync' functions is returned:
        - Insert: Receives a document (object) and inserts it (in memory) into the database.
        - Query: Receives an expression to be used as a filter (in a filter) on the database values.
        - Sync: Synchronizes the in-memory data with the on-disk file.
    - There are other private functions and properties that are not part of the MycroDatabase object's API:
        - __load
        -__save
        - __nextId
        -__filePath
        - __memory
        -__id

## v0.0.1

    - GitHub repository created with some configuration files and initial project structure.

## v0.0.0

    - Package published on npm.
