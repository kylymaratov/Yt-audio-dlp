import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import path from "path";
import typescript from "@rollup/plugin-typescript";

export default [
    {
        input: "dist/index.js",
        output: [
            {
                file: "dist/index.cjs",
                format: "cjs",
            },
        ],
        plugins: [
            alias({
                entries: [{ find: "@", replacement: path.resolve("dist") }],
            }),
            resolve(),
            commonjs(),
            json(),
            typescript(),
        ],
    },
];
