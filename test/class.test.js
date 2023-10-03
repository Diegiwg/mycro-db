import ava from "ava";
import fs from "fs";

import { JsonStorage, MemoryStorage, MycroDatabase } from "../lib/index.js";

ava("Database in Memory only mode", (t) => {
    const storage = new MemoryStorage();

    const db = new MycroDatabase(storage);
    const col = db.collection("col", { value: String() });

    col.insert({ value: "a" });

    const result = col.query();
    const expected = {
        docs: [
            {
                id: 1,
                value: "a",
            },
        ],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);
});

const storage = new JsonStorage("./test/test.json");

ava("Database synced to a JSON file", (t) => {
    const db = new MycroDatabase(storage);

    const col = db.collection("col", { value: String() });

    col.insert({ value: "a" });

    const result = col.query();
    const expected = {
        docs: [
            {
                id: 1,
                value: "a",
            },
        ],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);
});

ava("Load a data from JSON file", (t) => {
    const db = new MycroDatabase(storage);

    const col = db.collection("col", { value: String() });

    const result = col.query();
    const expected = {
        docs: [
            {
                id: 1,
                value: "a",
            },
        ],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);

    fs.unlinkSync("./test/test.json");
});
