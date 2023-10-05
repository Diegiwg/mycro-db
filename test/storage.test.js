import ava from "ava";

import { MycroDatabase } from "../lib/index.js";

ava("Testing a Expanded Storage API", (t) => {
    const fakeStorage = {
        read: () => {},
        write: () => {},

        create: () => {
            return "Expanded Storage API";
        },

        insert: (ref) => {
            return () => {
                return "Expanded Storage API";
            };
        },
    };

    const db = new MycroDatabase(fakeStorage);
    const col = db.collection("col", { value: String() });

    const result = col.insert(); // Always returns "Expanded Storage API" for testing purpose
    const expected = "Expanded Storage API";

    t.is(result, expected);
});
