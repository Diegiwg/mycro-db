import ava from "ava";

import { MycroDatabase } from "../lib/mycro-db.js";

ava("Get a single document from the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { value: String() });

    col.insert({ value: "a" }, { value: "b" });

    const result = col.query((doc) => doc.value === "a");
    const expected = [{ id: 1, value: "a" }];

    t.deepEqual(result, expected);
});

ava("Get tree documents from the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { value: String(), another: String() });

    col.insert(
        { value: "a", another: "x" },
        { value: "b", another: "y" },
        { value: "c", another: "y" },
        { value: "d", another: "y" }
    );

    const result = col.query((doc) => doc.another === "y");
    const expected = [
        { id: 2, value: "b", another: "y" },
        { id: 3, value: "c", another: "y" },
        { id: 4, value: "d", another: "y" },
    ];

    t.deepEqual(result, expected);
});

ava("Get all documents from the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { value: String() });

    col.insert({ value: "a" }, { value: "b" }, { value: "c" });

    const result = col.query();
    const expected = [
        { id: 1, value: "a" },
        { id: 2, value: "b" },
        { id: 3, value: "c" },
    ];

    t.deepEqual(result, expected);
});

ava("Try get a non-existing document from the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { value: String() });

    col.query((doc) => doc.value === "a");

    const result = col.query();
    const expected = [];

    t.deepEqual(result, expected);
});
