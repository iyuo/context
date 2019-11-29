import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";

import pkg from "./package.json";

export default [{
  input: pkg.source,
  output: [
    {
      name: pkg.umdName,
      file: pkg.main,
      format: "umd",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  watch: {
    include: "src/**/*"
  },
  plugins: [
    json(),
    typescript({
      typescript: require("typescript")
    }),
    resolve(),
    commonjs(),
  ]
},
{
  input: pkg.source,
  output: {
    file: pkg.main_min,
    name: pkg.umdName,
    format: "umd"
  },
  plugins: [
    json(),
    typescript({
      typescript: require("typescript"),
    }),
    resolve(),
    commonjs(),
    uglify()
  ]
}
];
