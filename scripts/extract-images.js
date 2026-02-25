const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "tanilei-landing.html");
const outDir = path.join(__dirname, "..", "public", "images");
const names = ["hero_hair.png", "tani_headshot.png", "kit_mockup.png"];

if (!fs.existsSync(htmlPath)) {
  console.error("tanilei-landing.html not found");
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");
const regex = /src="data:image\/png;base64,([^"]+)"/g;
const matches = [...html.matchAll(regex)];

if (matches.length < 3) {
  console.error("Expected at least 3 base64 images, found", matches.length);
  process.exit(1);
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (let i = 0; i < 3; i++) {
  const base64 = matches[i][1];
  const outPath = path.join(outDir, names[i]);
  fs.writeFileSync(outPath, Buffer.from(base64, "base64"));
  console.log("Wrote", names[i]);
}

console.log("Done.");
