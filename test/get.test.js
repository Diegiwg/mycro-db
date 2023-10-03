import ava from "ava";

import { MemoryStorage, MycroDatabase } from "../lib/index.js";

ava("Get a single document from the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    col.insert([{ value: "a" }, { value: "b" }]);

    const result = col.get(1);
    const expected = [
        {
            id: 1,
            value: "a",
        },
    ];

    t.deepEqual(result, expected);
});

ava("Get tree documents from the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String(), another: String() });

    col.insert([
        { value: "a", another: "x" },
        { value: "b", another: "y" },
        { value: "c", another: "y" },
        { value: "d", another: "y" },
    ]);

    const result = col.get([2, 3, 4]);
    const expected = [
        { id: 2, value: "b", another: "y" },
        { id: 3, value: "c", another: "y" },
        { id: 4, value: "d", another: "y" },
    ];
    t.deepEqual(result, expected);
});

ava("Try get a non-existing document from the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    const result = col.get(0);
    const expected = [];

    t.deepEqual(result, expected);
});
