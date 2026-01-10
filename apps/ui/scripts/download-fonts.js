import fs from "fs";
import path from "path";
import https from "https";

const GITHUB_API_URL =
  "https://api.github.com/repos/typst/typst-assets/git/trees/main?recursive=1";
const RAW_CONTENT_URL_BASE = "https://github.com/typst/typst-assets/raw/main/";

const publicDir = path.join(process.cwd(), "public");
const fontsDir = path.join(publicDir, "fonts");

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// --- UTILITY FUNCTIONS ---
const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, options, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          return request(response.headers.location, options)
            .then(resolve)
            .catch(reject);
        }
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(
            new Error(`Failed to get '${url}' (${response.statusCode})`),
          );
        }
        resolve(response);
      })
      .on("error", reject);
  });
};

const downloadFile = async (url, dest) => {
  const response = await request(url);
  const fileStream = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    response.pipe(fileStream);
    fileStream.on("finish", () => fileStream.close(resolve));
    fileStream.on("error", reject);
  });
};

const getRepoTree = async () => {
  const options = { headers: { "User-Agent": "node.js" } };
  const response = await request(GITHUB_API_URL, options);
  let data = "";
  for await (const chunk of response) {
    data += chunk;
  }
  return JSON.parse(data).tree;
};

// --- MAIN EXECUTION ---
(async () => {
  try {
    console.log("Fetching font list from GitHub...");
    const tree = await getRepoTree();
    const fontFiles = tree.filter(
      (item) =>
        item.path.startsWith("files/fonts/") &&
        (item.path.endsWith(".ttf") || item.path.endsWith(".otf")),
    );

    if (fontFiles.length === 0) {
      console.error(
        "Error: No fonts found in 'files/fonts/'. Please check the typst-assets repository structure.",
      );
      process.exit(1);
    }

    const downloadPromises = fontFiles.map((file) => {
      const fileName = path.basename(file.path);
      const destPath = path.join(fontsDir, fileName);
      const url = `${RAW_CONTENT_URL_BASE}${file.path}`;

      console.log(`Downloading ${fileName}...`);
      return downloadFile(url, destPath)
        .then(() => {
          console.log(`Downloaded ${fileName}.`);
          return `/fonts/${fileName}`; // Return the client-side path for the manifest
        })
        .catch((error) => {
          console.error(`Failed to download ${fileName}:`, error);
          return null;
        });
    });

    const fontPaths = (await Promise.all(downloadPromises)).filter(Boolean);

    const manifestPath = path.join(fontsDir, "manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(fontPaths, null, 2));
    console.log(`Font manifest created at ${manifestPath}`);
  } catch (error) {
    console.error("Failed to download fonts:", error);
    process.exit(1);
  }
})();
