import ava from "ava";

import { MemoryStorage, MycroDatabase } from "../lib/index.js";

ava("Query a single document from the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    col.insert([{ value: "a" }, { value: "b" }]);

    const result = col.query((doc) => doc.value === "a");
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

ava("Query tree documents from the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String(), another: String() });

    col.insert([
        { value: "a", another: "x" },
        { value: "b", another: "y" },
        { value: "c", another: "y" },
        { value: "d", another: "y" },
    ]);

    const result = col.query((doc) => doc.another === "y");
    const expected = {
        docs: [
            { id: 2, value: "b", another: "y" },
            { id: 3, value: "c", another: "y" },
            { id: 4, value: "d", another: "y" },
        ],
        limit: 25,
        offset: 0,
    };
    t.deepEqual(result, expected);
});

ava("Query all documents from the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    col.insert([{ value: "a" }, { value: "b" }, { value: "c" }]);

    const DOCS_IN_DB = col.count();

    const result = col.query(null, DOCS_IN_DB);
    const expected = {
        docs: [
            { id: 1, value: "a" },
            { id: 2, value: "b" },
            { id: 3, value: "c" },
        ],
        limit: DOCS_IN_DB,
        offset: 0,
    };

    t.deepEqual(result, expected);
});

ava("Try query a non-existing document from the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    col.query((doc) => doc.value === "a");

    const result = col.query();
    const expected = {
        docs: [],
        limit: 25,
        offset: 0,
    };

    t.deepEqual(result, expected);
});
