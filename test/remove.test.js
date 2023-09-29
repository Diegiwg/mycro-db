import ava from "ava";

import { MycroDatabase } from "../lib/mycro-db.js";

ava("Remove a unique document from the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { id: Number(), value: String() });

    col.insert({ value: "a" });
    col.insert({ value: "b" });

    col.remove((doc) => doc.value === "a");

    const result = col.query();
    const expected = [{ id: 2, value: "b" }];

    t.deepEqual(result, expected);
});

ava("Remove tree documents from the collection", (t) => {
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

    col.remove((doc) => doc.another === "y");

    const result = col.query();
    const expected = [{ id: 1, value: "a", another: "x" }];

    t.deepEqual(result, expected);
});

ava("Remove all documents from the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { id: Number(), value: String() });

    col.insert({ value: "a" });
    col.insert({ value: "b" });
    col.insert({ value: "c" });

    col.remove((_) => true);

    const result = col.query();
    const expected = [];

    t.deepEqual(result, expected);
});

ava("Try remove a non-existing document from the collection", (t) => {
    const db = new MycroDatabase();
    const col = db.collection("col", { id: Number(), value: String() });

    col.remove((doc) => doc.value === "a");

    const result = col.query();
    const expected = [];

    t.deepEqual(result, expected);
});

// TODO: Test fail on try remove without filter
