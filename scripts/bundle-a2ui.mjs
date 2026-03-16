import { createHash } from "node:crypto";
import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const HASH_FILE = path.join(ROOT_DIR, "src/canvas-host/a2ui/.bundle.hash");
const OUTPUT_FILE = path.join(ROOT_DIR, "src/canvas-host/a2ui/a2ui.bundle.js");
const A2UI_RENDERER_DIR = path.join(ROOT_DIR, "vendor/a2ui/renderers/lit");
const A2UI_APP_DIR = path.join(ROOT_DIR, "apps/shared/LalaKit/Tools/CanvasA2UI");

async function walk(entryPath, files = []) {
  const st = await fs.stat(entryPath);
  if (st.isDirectory()) {
    const entries = await fs.readdir(entryPath);
    for (const entry of entries) {
      await walk(path.join(entryPath, entry), files);
    }
    return files;
  }
  files.push(entryPath);
  return files;
}

function normalize(p) {
  return p.split(path.sep).join("/");
}

async function computeHash() {
  const inputPaths = [
    path.join(ROOT_DIR, "package.json"),
    path.join(ROOT_DIR, "pnpm-lock.yaml"),
    A2UI_RENDERER_DIR,
    A2UI_APP_DIR,
  ].filter(p => existsSync(p));

  const allFiles = [];
  for (const input of inputPaths) {
    await walk(input, allFiles);
  }

  allFiles.sort((a, b) => normalize(a).localeCompare(normalize(b)));

  const hash = createHash("sha256");
  for (const filePath of allFiles) {
    const rel = normalize(path.relative(ROOT_DIR, filePath));
    hash.update(rel);
    hash.update("\0");
    hash.update(await fs.readFile(filePath));
    hash.update("\0");
  }

  return hash.digest("hex");
}

async function main() {
  if (!existsSync(A2UI_RENDERER_DIR) || !existsSync(A2UI_APP_DIR)) {
    if (existsSync(OUTPUT_FILE)) {
      console.log("A2UI sources missing; keeping prebuilt bundle.");
      process.exit(0);
    }
    console.warn(`A2UI sources missing and no prebuilt bundle found. Skipping A2UI bundling.`);
    process.exit(0);
  }

  const currentHash = await computeHash();
  if (existsSync(HASH_FILE)) {
    const previousHash = (await fs.readFile(HASH_FILE, "utf8")).trim();
    if (previousHash === currentHash && existsSync(OUTPUT_FILE)) {
      console.log("A2UI bundle up to date; skipping.");
      process.exit(0);
    }
  }

  console.log("Bundling A2UI...");
  
  const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  
  // Run tsc
  const tscRes = spawnSync(pnpm, ["-s", "exec", "tsc", "-p", path.join(A2UI_RENDERER_DIR, "tsconfig.json")], {
    cwd: ROOT_DIR,
    stdio: "inherit",
    shell: true,
  });
  if (tscRes.status !== 0) process.exit(tscRes.status ?? 1);

  // Run rolldown
  const rollRes = spawnSync(pnpm, ["-s", "exec", "rolldown", "-c", path.join(A2UI_APP_DIR, "rolldown.config.mjs")], {
    cwd: ROOT_DIR,
    stdio: "inherit",
    shell: true,
  });
  if (rollRes.status !== 0) {
    // Fallback to dlx if not found
    const rollDlxRes = spawnSync(pnpm, ["-s", "dlx", "rolldown", "-c", path.join(A2UI_APP_DIR, "rolldown.config.mjs")], {
      cwd: ROOT_DIR,
      stdio: "inherit",
      shell: true,
    });
    if (rollDlxRes.status !== 0) process.exit(rollDlxRes.status ?? 1);
  }

  await fs.writeFile(HASH_FILE, currentHash);
  console.log("A2UI bundling complete.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
