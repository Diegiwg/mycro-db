import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "./src/index.js",
    output: [
        {
            file: "mycro-db.js",
            format: "cjs",
            name: "mycro-db",
        },
        {
            file: "mycro-db.esm.js",
            format: "esm",
            name: "mycro-db",
        },
    ],
    plugins: [resolve(), commonjs(), babel({ babelHelpers: "bundled" })],
};
