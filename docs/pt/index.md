# MycroDB 📦

[![Logo](../public/logo.png)](https://www.npmjs.com/package/mycro-db)

[Documentação em Inglês](https://diegiwg.github.io/mycro-db)

## Visão Geral do Projeto 🚀

MycroDB é uma biblioteca JavaScript projetada para gerenciar Bancos de Dados de Documentos armazenados em um único arquivo JSON ou na memória.

MycroDB é publicado como uma biblioteca no NPM, que você pode encontrar em [https://www.npmjs.com/package/mycro-db](https://www.npmjs.com/package/mycro-db).

## Projeto de Exemplo

Para demonstrar como o MycroDB funciona, desenvolvemos um projeto de exemplo que implementa uma Interface de Linha de Comando (CLI) para o gerenciamento de tarefas. Para obter mais informações sobre esse projeto, visite seu repositório dedicado em [Todz](https://github.com/Diegiwg/todz).

## Instalação

Para integrar o MycroDB em seu projeto, você pode instalá-lo via npm (ou outros gerenciadores de pacotes):

```shell
npm install mycro-db
```

## API do MycroDB

Para começar, importe a classe 'MycroDatabase' juntamente com uma classe 'Storage' e inicialize ambos os objetos:

```javascript
import { JsonStorage, MemoryStorage, MycroDatabase } from 'mycro-db';

// Modo de memória
const inMemoryStorage = new MemoryStorage();
const db = new MycroDatabase(inMemoryStorage);

// Modo de arquivo JSON
const jsonStorage = new JsonStorage('my_database.json');
const db = new MycroDatabase(jsonStorage);
```

### API de Coleções

Para manter os dados organizados, a biblioteca utiliza uma estrutura de coleções. Use coleções para categorizar logicamente seus dados.

#### Definir uma Coleção

Para criar uma coleção, você deve fornecer um nome e, opcionalmente, pode incluir um modelo (um objeto com propriedades e seus tipos de dados correspondentes) para melhorar a intellisense do IDE.

```javascript
const User = db.collection('users', { name: String(), age: Number() });
```

#### Inserir um Documento em uma Coleção

Para inserir um documento em uma coleção, você deve fornecer um objeto JavaScript simples com valores compatíveis com JSON. Você pode inserir um ou mais documentos em uma única operação passando uma matriz de objetos de documentos.

```javascript
User.insert([
    { name: 'Alice', age: 28 },
    { name: 'Bob', age: 30 }
]);
```

#### Atualizar um Documento em uma Coleção

Para atualizar um documento, forneça um objeto contendo a chave 'id' com o ID do documento a ser atualizado e a chave 'data' contendo um objeto com os pares 'chave: valor' a serem atualizados no documento. A atualização é atômica, o que significa que apenas os valores fornecidos no objeto serão atualizados, enquanto os outros valores no documento permanecem inalterados. Você pode atualizar um ou mais documentos em uma única operação passando uma matriz de objetos de documentos.

```javascript
User.update([
    { id: 1, data: { age: 45 } }
]);
```

#### Obter um Documento em uma Coleção

Para recuperar um documento de uma coleção, forneça um ID do documento. Você pode obter um ou mais documentos em uma única operação passando uma matriz de IDs.

```javascript
User.get([
    1, 5
]);
```

#### Consultar Documentos em uma Coleção

Para consultar documentos em uma coleção, forneça uma função de estratégia (filtro). Se nenhuma função de filtro for fornecida, todos os documentos serão retornados. A quantidade de documentos retornados depende do parâmetro 'limite', e o parâmetro de deslocamento é usado para 'paginação'. Todos os parâmetros são opcionais. Por padrão, o limite é 25 e o deslocamento é 0.

```javascript
const estrategia = (usuário) => usuário.age > 21;
const limite = 10;
const deslocamento = 0;

User.query(estrategia, limite, deslocamento);
```

#### Remover um Documento de uma Coleção

Para remover um documento, forneça um ID do documento. Você pode remover um ou mais documentos em uma única operação passando uma matriz de IDs.

```javascript
User.remove([
    1, 5
]);
```

## Estratégias de Armazenamento Incorporadas

A biblioteca suporta as seguintes estratégias de armazenamento:

### Na Memória

Esta é a estratégia mais simples, salvando os dados na memória até que a aplicação seja recarregada e todos os dados sejam apagados.

```javascript
import { MemoryStorage } from 'mycro-db';

const armazenamento = new MemoryStorage();
const db = new MycroDatabase(armazenamento);
```

### JSON

Esta é a estratégia mais comum e é ideal para aqueles que precisam de flexibilidade e persistência. Você pode fornecer um esquema, mas ele é principalmente usado como referência para a intellisense do IDE.

```javascript
import { JsonStorage } from 'mycro-db';

const armazenamento = new JsonStorage('my_database.json');
const db = new MycroDatabase(armazenamento);
```

### JSON Tipado

Esta estratégia oferece a mesma funcionalidade do JSON, mas incorpora um 'Esquema' para as funções de 'inserção' e 'atualização', garantindo que os documentos adicionados ao banco de dados estejam de acordo com a estrutura esperada (sem campos extras e tipos de dados corretos). Se um campo extra ou um valor incorreto for fornecido, um erro será gerado.

```javascript
import { TypedJsonStorage } from 'mycro-db';

const armazenamento = new TypedJsonStorage('my_database.json');
const db = new MycroDatabase(armazenamento);

const usuário = db.collection('usuários', { nome: String(), idade: Number() });
// Aqui, é definido que um usuário possui campos Nome e Idade, respectivamente uma String e um Número.
```

## Registro de Alterações

Para obter um histórico detalhado das alterações neste projeto, consulte o arquivo [changes.md](changes.md) no diretório raiz.

## Licença 📜

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.
