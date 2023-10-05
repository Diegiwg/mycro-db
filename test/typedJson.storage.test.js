import ava from "ava";
import fs from "fs";

import { MycroDatabase, TypedJsonStorage } from "../lib/index.js";

function clearFile() {
    if (fs.existsSync("./test/test.json")) fs.unlinkSync("./test/test.json");
}

clearFile();

ava(
    "Insert a unique (complex) document into the collection with correct type",
    (t) => {
        const storage = new TypedJsonStorage("./test/test.json");
        const db = new MycroDatabase(storage);

        const col = db.collection("col", {
            value: { extend: [{ key: [Number()] }], another: String() },
        });

        col.insert({
            value: {
                extend: [{ key: [1, 2] }, { key: [3] }],
                another: "hello",
            },
        });

        const result = col.query();
        const expected = {
            docs: [
                {
                    id: 1,
                    value: {
                        extend: [{ key: [1, 2] }, { key: [3] }],
                        another: "hello",
                    },
                },
            ],
            limit: 25,
            offset: 0,
        };

        t.deepEqual(result, expected);

        clearFile();
    }
);

ava("Insert tree documents into the collection with correct type", (t) => {
    const storage = new TypedJsonStorage("./test/test.json");
    const db = new MycroDatabase(storage);

    const col = db.collection("col", {
        value: String(),
    });

    col.insert([{ value: "a" }, { value: "b" }, { value: "c" }]);

    const result = col.query();
    const expected = {
        docs: [
            { id: 1, value: "a" },
            { id: 2, value: "b" },
            { id: 3, value: "c" },
        ],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);

    clearFile();
});

ava(
    "Throws an error when insert a unique document into the collection with incorrect type",
    (t) => {
        const storage = new TypedJsonStorage("./test/test.json");
        const db = new MycroDatabase(storage);

        const col = db.collection("col", { value: String() });

        t.throws(() => {
            col.insert({ value: 9999 });
        });

        clearFile();
    }
);

ava("Throws an error when insert tree documents into the collection", (t) => {
    const storage = new TypedJsonStorage("./test/test.json");
    const db = new MycroDatabase(storage);

    const col = db.collection("col", {
        value: String(),
    });

    t.throws(() => {
        col.insert([{ value: 1 }, { value: 2 }]);
    });

    clearFile();
});

ava(
    "Throws an error when insert a document with a non-existent key in schema",
    (t) => {
        const storage = new TypedJsonStorage("./test/test.json");
        const db = new MycroDatabase(storage);

        const col = db.collection("col", {
            value: String(),
        });

        t.throws(() => {
            col.insert({ value: "a", another: "b" });
        });

        clearFile();
    }
);

ava("Update a unique document in the collection with correct type", (t) => {
    const storage = new TypedJsonStorage("./test/test.json");
    const db = new MycroDatabase(storage);

    const col = db.collection("col", { value: String() });

    col.insert([{ value: "a" }, { value: "b" }]);

    col.update({ id: 1, data: { value: "c" } });

    const result = col.query();
    const expected = {
        docs: [
            { id: 1, value: "c" },
            { id: 2, value: "b" },
        ],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);

    clearFile();
});

ava("Update tree documents in the collection with correct type", (t) => {
    const storage = new TypedJsonStorage("./test/test.json");
    const db = new MycroDatabase(storage);

    const col = db.collection("col", { value: String(), another: String() });

    col.insert([
        { value: "a", another: "x" },
        { value: "b", another: "y" },
        { value: "c", another: "y" },
        { value: "d", another: "y" },
    ]);

    col.update([
        { id: 2, data: { another: "z" } },
        { id: 3, data: { another: "z" } },
        { id: 4, data: { another: "z" } },
    ]);

    const result = col.query();
    const expected = {
        docs: [
            { another: "x", id: 1, value: "a" },
            { another: "z", id: 2, value: "b" },
            { another: "z", id: 3, value: "c" },
            { another: "z", id: 4, value: "d" },
        ],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);

    clearFile();
});

ava(
    "Throws an error when update a unique document in the collection with incorrect type",
    (t) => {
        const storage = new TypedJsonStorage("./test/test.json");
        const db = new MycroDatabase(storage);

        const col = db.collection("col", {
            value: String(),
            another: String(),
        });

        col.insert([{ value: "a" }]);

        t.throws(() => {
            col.update({ id: 1, data: { value: 9999 } });
        });

        clearFile();
    }
);

ava(
    "Throws an error when update tree documents in the collection with incorrect type",
    (t) => {
        const storage = new TypedJsonStorage("./test/test.json");
        const db = new MycroDatabase(storage);

        const col = db.collection("col", {
            value: String(),
            another: String(),
        });

        col.insert([
            { value: "a", another: "x" },
            { value: "b", another: "y" },
            { value: "c", another: "y" },
            { value: "d", another: "y" },
        ]);

        t.throws(() => {
            col.update([
                { id: 2, data: { another: 1 } },
                { id: 3, data: { another: 2 } },
                { id: 4, data: { another: 3 } },
            ]);
        });

        clearFile();
    }
);
