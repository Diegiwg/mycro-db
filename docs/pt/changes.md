# Arquivo de Rastreamento de Versão

## v1.2.5

    - Corrigido bug relacionado à sincronização entre disco e memória.

## v1.2.4

    - Corrigido o link do logotipo na documentação em português.
    - Lançada a versão com a correção no npm.

## v1.2.3

    - Adicionada uma categoria de documentação em português à página do GitHub.
    - Um link para esta documentação foi adicionado ao README.

## v1.2.2

    - Corrigido um bug no sistema de genéricos que garante a intellisense nas coleções.
    - Modificada a estrutura de arquivo de alterações.

## v1.2.1

    - Atualizado o README para adicionar uma referência à nova Estratégia de Armazenamento (TypedJson).

## v1.2.0

    - Adicionado um novo modelo de armazenamento: TypedJson.
    - Características:
            Agora, quando um esquema existe, todos os dados inseridos/atualizados são verificados.
            Se o tipo de um dado ou uma chave que não existe no esquema é fornecido no Documento, um erro será gerado.
            Casos complexos foram testados, como: { value: [ { key: String(), xxx: [ Number() ] } ], required: Boolean() }.
        - Dado este exemplo, em tempo de execução, cada documento será testado em busca dos seguintes requisitos:
        - required: se existir no Documento anterior, deve ser um booleano.
        - value: se existir no documento, deve ser um array.
                        Cada valor dentro deste array deve ser um objeto:
                            - key: se existir no objeto, deve ser uma string.
                            - xxx: se existir no objeto, deve ser um array de números.
            Vários casos foram testados e, aparentemente, a função de validação '(utils/validateSchema.js)' está funcionando corretamente.

## v1.1.1

    - Corrigido o arquivo .npmignore.

## v1.1.0

    - A API de Armazenamento foi aprimorada com a opção de substituir as funções disponíveis na API de Coleções.
        - Isso visa principalmente permitir métodos mais complexos em Armazenamentos mais intricados.

## v1.0.1

    - Corrigido o arquivo .npmignore.

## v1.0.0

    - Reformulação de toda a API.
    - A biblioteca foi dividida em vários módulos.
    - Core
        - MycroDatabase: A classe principal da biblioteca, usada para construir o wrapper de acesso ao banco de dados.
        - Collection: Uma classe que representa uma coleção e fornece acesso aos seus métodos de manipulação.
    - Storage:
        - Memory: Uma classe que representa um banco de dados em memória.
        - JSON: Uma classe que representa um banco de dados baseado em disco no formato JSON.

## v0.4.1

    - Adicionado um 'site estático' usando as Páginas do Github.

## v0.4.0

    - Removido o antigo script de compilação.
        - 'insert' agora aceita vários documentos, tornando mais simples a inserção de vários documentos de uma vez.
            - Exemplo: `db.collection('users', {id: 0, name: "", age: 0}).insert([{name: "John Doe", age: 20}, {name: "Jane Doe, age: 30}])`
        - 'insert', 'update' e 'remove' agora retornam a lista de IDs relacionados aos documentos afetados (criados, modificados e removidos).
        - Melhorias gerais na validação de argumentos para funções.
        - Testes atualizados para refletir as mudanças.
        - Documentação do README atualizada.

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
