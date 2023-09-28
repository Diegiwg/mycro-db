import ava from "ava";
import fs from "fs";

import { MycroDatabase } from "../src/index.js";

function clear() {
    if (fs.existsSync("./test/test.json")) {
        fs.unlinkSync("./test/test.json");
    }
}

clear();

const UserSchema = {
    id: 0,
    name: "",
    email: "",
    url: "",
};

const DefaultUser = {
    name: "John Doe",
    email: "johndoe@email.com",
    url: "john-doe.com",
};

const db = new MycroDatabase("./test/test.json");

const User = db.collection("users", UserSchema);

ava("Insert a new Document", (t) => {
    User.insert(DefaultUser);

    const result = User.query((doc) => doc.name === "John Doe");
    const expected = [
        {
            id: 1,
            name: "John Doe",
            email: "johndoe@email.com",
            url: "john-doe.com",
        },
    ];

    t.deepEqual(result, expected);
});

ava("Sync the database", (t) => {
    db.sync();

    t.true(fs.existsSync("./test/test.json"));

    const content = fs.readFileSync("./test/test.json", "utf-8");

    const result = JSON.parse(content);
    const expected = {
        memory: {
            users: {
                documents: {
                    1: {
                        id: 1,
                        name: "John Doe",
                        email: "johndoe@email.com",
                        url: "john-doe.com",
                    },
                },
                id: 2,
            },
        },
        collections: {
            users: true,
        },
    };

    t.deepEqual(result, expected);
});

ava("Query all documents", (t) => {
    const result = db.collection("users", UserSchema).query();

    const expected = [
        {
            id: 1,
            name: "John Doe",
            email: "johndoe@email.com",
            url: "john-doe.com",
        },
    ];

    t.deepEqual(result, expected);
});

ava("Query a non-existent document", (t) => {
    const result = User.query((doc) => doc.name === "Another User");
    const expected = [];

    t.deepEqual(result, expected);
});

ava("Load the database from disk", (t) => {
    const localDB = new MycroDatabase("./test/test.json");

    const result = localDB.collection("users", UserSchema).query();
    const expected = [
        {
            id: 1,
            name: "John Doe",
            email: "johndoe@email.com",
            url: "john-doe.com",
        },
    ];

    t.deepEqual(result, expected);
});
