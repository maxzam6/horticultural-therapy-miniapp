import fs from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve("dist/build/mp-weixin");
const sourceRoot = path.resolve("cloudfunctions");
const targetRoot = path.join(outputRoot, "cloudfunctions");
const projectConfigPath = path.join(outputRoot, "project.config.json");

await fs.access(projectConfigPath);
await fs.rm(targetRoot, { recursive: true, force: true });
await fs.cp(sourceRoot, targetRoot, {
  recursive: true,
  filter(source) {
    const name = path.basename(source);
    return name !== "node_modules" && name !== ".env" && !name.endsWith(".log");
  },
});

const projectConfig = JSON.parse(await fs.readFile(projectConfigPath, "utf8"));
projectConfig.cloudfunctionRoot = "cloudfunctions/";
await fs.writeFile(
  projectConfigPath,
  `${JSON.stringify(projectConfig, null, 2)}\n`,
  "utf8",
);

console.log(
  "Cloud build prepared: import dist/build/mp-weixin and deploy cloudfunctions/garden-api.",
);
