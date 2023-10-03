import ava from "ava";

import { MemoryStorage, MycroDatabase } from "../lib/index.js";

ava("Update a unique document in the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
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
});

ava("Update tree documents in the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
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
});

ava("Try update a non-existing document in the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    col.update({ id: 1, data: { value: "c" } });

    const result = col.query();
    const expected = {
        docs: [],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);
});
