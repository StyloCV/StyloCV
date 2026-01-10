import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const uiDir = path.resolve(process.cwd());
const pkgsDir = path.resolve(uiDir, "..", "..");
const cvModelPkgDir = path.resolve(pkgsDir, "pkgs", "cv_model");
const outputDir = path.resolve(uiDir, "public", "wheels");

console.log("--------------------------------------------------");
console.log("Building cv_model Python package...");

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Clean the output directory
const files = fs.readdirSync(outputDir);
for (const file of files) {
  if (file.startsWith("cv_model")) {
    fs.unlinkSync(path.join(outputDir, file));
    console.log(`Removed old wheel: ${file}`);
  }
}

// Construct the build command
const command = `uv build --out-dir "${outputDir}"`;

try {
  // Execute the command in the cv_model package directory
  execSync(command, { cwd: cvModelPkgDir, stdio: "inherit" });
  console.log("Successfully built cv_model package.");

  // Find the generated wheel file
  const builtFiles = fs.readdirSync(outputDir);
  const wheelFile = builtFiles.find((file) => file.endsWith(".whl"));

  if (!wheelFile) {
    throw new Error("Could not find built wheel file.");
  }

  // Create a manifest file
  const manifest = { wheelFile };
  fs.writeFileSync(
    path.join(outputDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(`Created wheel manifest for: ${wheelFile}`);

  console.log("--------------------------------------------------");
} catch (error) {
  console.error("Failed to build cv_model package:", error);
  process.exit(1);
}
