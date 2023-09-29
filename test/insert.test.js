import ava from "ava";

import { MycroDatabase } from "../lib/mycro-db.js";

ava("Insert a unique document into the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { id: Number(), value: String() });

    col.insert({ value: "a" });

    const result = col.query();
    const expected = [{ id: 1, value: "a" }];

    t.deepEqual(result, expected);
});

ava("Insert tree documents into the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", {
        id: Number(),
        value: String(),
    });

    col.insert({ value: "a" });
    col.insert({ value: "b" });
    col.insert({ value: "c" });

    const result = col.query();
    const expected = [
        { id: 1, value: "a" },
        { id: 2, value: "b" },
        { id: 3, value: "c" },
    ];

    t.deepEqual(result, expected);
});

// TODO: Test fail to try insert a undefined document
