import ava from "ava";

import { MycroDatabase } from "../lib/mycro-db.js";

ava("Update a unique document in the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { id: Number(), value: String() });

    col.insert({ value: "a" });
    col.insert({ value: "b" });

    col.update((doc) => doc.value === "a", { value: "c" });

    const result = col.query();
    const expected = [
        { id: 1, value: "c" },
        { id: 2, value: "b" },
    ];

    t.deepEqual(result, expected);
});

ava("Update tree documents in the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", {
        id: Number(),
        value: String(),
        another: String(),
    });

    col.insert({ value: "a", another: "x" });
    col.insert({ value: "b", another: "y" });
    col.insert({ value: "c", another: "y" });
    col.insert({ value: "d", another: "y" });

    col.update((doc) => doc.another === "y", { another: "z" });

    const result = col.query();
    const expected = [
        { id: 1, value: "a", another: "x" },
        { id: 2, value: "b", another: "z" },
        { id: 3, value: "c", another: "z" },
        { id: 4, value: "d", another: "z" },
    ];

    t.deepEqual(result, expected);
});

ava("Update all documents in the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { id: Number(), value: String() });

    col.insert({ value: "a" });
    col.insert({ value: "b" });
    col.insert({ value: "c" });

    col.update((_) => true, { value: "" });

    const result = col.query();
    const expected = [
        { id: 1, value: "" },
        { id: 2, value: "" },
        { id: 3, value: "" },
    ];

    t.deepEqual(result, expected);
});

ava("Try update a non-existing document in the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { id: Number(), value: String() });

    col.update((doc) => doc.value === "a", { value: "c" });

    const result = col.query();
    const expected = [];

    t.deepEqual(result, expected);
});
