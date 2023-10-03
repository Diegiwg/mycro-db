import ava from "ava";

import { MemoryStorage, MycroDatabase } from "../lib/index.js";

ava("Insert a unique document into the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    col.insert({ value: "a" });

    const result = col.query();
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

ava("Insert tree documents into the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", {
        id: Number(),
        value: String(),
    });

    col.insert([{ value: "a" }, { value: "b" }, { value: "c" }]);

    const result = col.query();
    const expected = {
        docs: [
            { id: 1, value: "a" },
            { id: 2, value: "b" },
            { id: 3, value: "c" },
        ],
        limit: 25,
        offset: 0,
    };
    t.deepEqual(result, expected);
});
