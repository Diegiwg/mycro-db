import ava from "ava";
import fs from "fs";

import { MycroDatabase } from "../src/index.js";

// SETUP: Deletar arquivo do banco de dados.
function clear() {
    if (fs.existsSync("./test/test.json")) {
        fs.unlinkSync("./test/test.json");
    }
}

clear();

// SETUP: Criar banco de dados.
const db = new MycroDatabase("./test/test.json");

// TEST: Inserir um registro no banco.
ava("Insert a new Document", (t) => {
    const User = db.collection("users", {
        id: 0,
        name: "",
        email: "",
        url: "",
    });

    User.insert({
        name: "Diego Queiroz",
        email: "diegiwg@gmail.com",
        url: "https://github.com/Diegiwg",
    });

    const result = db
        .collection("users")
        .query((doc) => doc.name === "Diego Queiroz");
    const expected = [
        {
            id: 1,
            name: "Diego Queiroz",
            email: "diegiwg@gmail.com",
            url: "https://github.com/Diegiwg",
        },
    ];

    t.deepEqual(result, expected);
});

// TEST: Sincronizar o banco de dados.
ava("Sync the database", (t) => {
    db.sync();

    t.true(fs.existsSync("./test/test.json"));

    const content = fs.readFileSync("./test/test.json", "utf-8");

    const result = JSON.parse(content);
    const expected = {
        memory: {
            1: {
                name: "Diego Queiroz",
                email: "diegiwg@gmail.com",
                url: "https://github.com/Diegiwg",
                id: 1,
            },
        },
        id: 2,
    };

    t.deepEqual(result, expected);
});

// TEST: Buscar todos os registros.
ava("Query all documents", (t) => {
    const result = db.collection("users").query();
    const expected = [
        {
            id: 1,
            name: "Diego Queiroz",
            email: "diegiwg@gmail.com",
            url: "https://github.com/Diegiwg",
        },
    ];

    t.deepEqual(result, expected);
});

//TEST: Buscar um registro que não existe.
ava("Query a non-existent document", (t) => {
    const result = db
        .collection("users")
        .query((doc) => doc.name === "John Doe");
    const expected = [];

    t.deepEqual(result, expected);
});

//TEST: Carregar banco de dados do disco.
ava("Load the database from disk", (t) => {
    const localDB = new MycroDatabase("./test/test.json");

    const result = localDB.collection("users").query();
    const expected = [
        {
            id: 1,
            name: "Diego Queiroz",
            email: "diegiwg@gmail.com",
            url: "https://github.com/Diegiwg",
        },
    ];

    t.deepEqual(result, expected);
});
