import { symlink, existsSync, mkdirSync, rmSync } from "fs";
import { resolve } from "path";

const source = resolve("node_modules/pyodide");
const dest = resolve("public/pyodide");
const destDir = resolve("public");

console.log(`Preparing Pyodide symlink...`);
console.log(`  Source: ${source}`);
console.log(`  Destination: ${dest}`);

try {
  // 1. Ensure the public directory exists.
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
    console.log(`  Created public directory at ${destDir}`);
  }

  // 2. If the destination symlink/directory already exists, remove it first.
  if (existsSync(dest)) {
    console.log(`  Removing existing symlink/directory at ${dest}`);
    rmSync(dest, { recursive: true, force: true });
  }

  // 3. Create the new symlink.
  // On Windows, type must be 'junction' for directories to work correctly.
  const type = process.platform === "win32" ? "junction" : "dir";
  symlink(source, dest, type, (err) => {
    if (err) {
      console.error("  Failed to create symlink:", err);
      process.exit(1);
    }
    console.log("  Successfully created Pyodide symlink.");
  });
} catch (error) {
  console.error("  An error occurred during script execution:", error);
  process.exit(1);
}
