// This file is copied from here:
//   https://github.com/TypeStrong/ts-node/issues/2100#issuecomment-2039564225
// In order to fix the warning message encountered when trying to run ts-node like:
//   node --loader ts-node/esm ./src/index.ts

// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("ts-node/esm", pathToFileURL("./"));
