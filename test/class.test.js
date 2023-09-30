import ava from "ava";
import fs from "fs";

import { MycroDatabase } from "../lib/mycro-db.js";

ava("Database in Memory only mode", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { value: String() });

    col.insert({ value: "a" });

    const result = col.query();
    const expected = [{ id: 1, value: "a" }];

    t.deepEqual(result, expected);
});

ava("Database synced to a JSON file", (t) => {
    const db = new MycroDatabase("./test/test.json");
    const col = db.collection("col", { value: String() });

    col.insert({ value: "a" });

    const result = col.query();
    const expected = [{ id: 1, value: "a" }];

    db.sync();

    t.deepEqual(result, expected);
});

ava("Load a data from JSON file", (t) => {
    const db = new MycroDatabase("./test/test.json");
    const col = db.collection("col", { value: String() });

    const result = col.query();
    const expected = [{ id: 1, value: "a" }];

    t.deepEqual(result, expected);

    fs.unlinkSync("./test/test.json");
});
