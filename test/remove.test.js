import ava from "ava";

import { MemoryStorage, MycroDatabase } from "../lib/index.js";

ava("Remove a unique document from the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());

    const col = db.collection("col", { value: String() });

    col.insert([{ value: "a" }, { value: "b" }]);

    col.remove(1);

    const result = col.query();
    const expected = {
        docs: [
            {
                id: 2,
                value: "b",
            },
        ],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);
});

ava("Remove tree documents from the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String(), another: String() });

    col.insert([
        { value: "a", another: "x" },
        { value: "b", another: "y" },
        { value: "c", another: "y" },
        { value: "d", another: "y" },
    ]);

    col.remove([2, 3, 4]);

    const result = col.query();
    const expected = {
        docs: [
            {
                another: "x",
                id: 1,
                value: "a",
            },
        ],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);
});

ava("Try remove a non-existing document from the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    col.remove(1);

    const result = col.query();
    const expected = {
        docs: [],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);
});
