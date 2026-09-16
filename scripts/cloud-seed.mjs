// Generate a non-secret initial import file. Does not contact or overwrite any cloud environment.
import { createRequire } from "node:module";
import { mockCourses } from "../src/mock/courses.js";
import fs from "node:fs/promises";
const require = createRequire(import.meta.url),
  { initialState } = require("../cloudfunctions/garden-api/domain.cjs"),
  {
    flatten,
    manifest,
  } = require("../cloudfunctions/garden-api/repository.cjs");
const uid = process.env.GARDEN_ADMIN_UID;
if (!uid)
  throw new Error(
    "Set GARDEN_ADMIN_UID to the trusted authentication UID (not a password)",
  );
const state = initialState(mockCourses, uid),
  docs = flatten(state);
await fs.mkdir("dist/cloud", { recursive: true });
await fs.writeFile(
  "dist/cloud/garden_state.json",
  Object.entries({ ...docs, manifest: manifest(state, docs) })
    .map(([id, data]) => JSON.stringify({ _id: id, ...data }))
    .join("\n"),
);
console.log(
  "Generated dist/cloud/garden_state.json. Import only into a NEW empty garden_state collection with client read/write denied.",
);
