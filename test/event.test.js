import ava from "ava";

import { MemoryStorage, MycroDatabase } from "../lib/index.js";

ava("Emit event when a document is inserted", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    let result = null;
    col.onInsert((e) => {
        result = e;
    });

    col.insert([{ value: "a" }, { value: "b" }]);

    t.true("docs" in result.data);
    t.is(result.data.docs.length, 2);
    t.like(result.data.docs, [{ value: "a" }, { value: "b" }]);
});

ava("Emit event when a document is updated", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    let result = null;
    col.onUpdate((e) => {
        result = e;
    });

    col.insert([{ value: "a" }, { value: "b" }]);
    col.update([{ id: 1, data: { value: "c" } }]);

    t.true("docs" in result.data);
    t.is(result.data.docs.length, 1);
    t.like(result.data.docs, [{ id: 1, value: "c" }]);
});

ava("Emit event when a document is removed", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    let result = null;
    col.onRemove((e) => {
        result = e;
    });

    col.insert([{ value: "a" }, { value: "b" }]);
    col.remove([1]);

    t.true("ids" in result.data);
    t.is(result.data.ids.length, 1);
    t.is(result.data.ids[0], 1);
});

ava("Emit event when a document is retrieved", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    let result = null;
    col.onGet((e) => {
        result = e;
    });

    col.insert([{ value: "a" }, { value: "b" }]);
    col.get([1]);

    t.true("docs" in result.data);
    t.is(result.data.docs.length, 1);
    t.like(result.data.docs, [{ id: 1, value: "a" }]);
});

ava("Emit event when a document is retrieved using a strategy", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    let result = null;
    col.onQuery((e) => {
        result = e;
    });

    col.insert([{ value: "a" }, { value: "b" }]);
    col.query((doc) => doc.value === "b");

    t.true("docs" in result.data);
    t.is(result.data.docs.length, 1);
    t.like(result.data.docs, [{ id: 2, value: "b" }]);
});

ava(
    "Emit event when the number of documents in the collection is retrieved",
    (t) => {
        const db = new MycroDatabase(new MemoryStorage());
        const col = db.collection("col", { value: String() });

        let result = null;
        col.onCount((e) => {
            result = e;
        });

        col.insert([{ value: "a" }, { value: "b" }]);
        col.count();

        t.true("count" in result.data);
        t.is(result.data.count, 2);
    }
);
