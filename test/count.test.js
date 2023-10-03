import ava from "ava";

import { MemoryStorage, MycroDatabase } from "../lib/index.js";

ava("Count the number of documents in the collection", (t) => {
    const db = new MycroDatabase(new MemoryStorage());
    const col = db.collection("col", { value: String() });

    col.insert([{ value: "a" }, { value: "b" }]);

    const result = col.count();
    const expected = 2;

    t.deepEqual(result, expected);
});
