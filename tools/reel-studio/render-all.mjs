/**
 * Batch-renders all 7 package promo reels.
 * Run: npm run render:all
 *
 * Output goes to output/ directory, one MP4 per package.
 */
import { execSync } from "child_process";
import { mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const OUTPUT_DIR = resolve(import.meta.dirname, "output");
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const COMPOSITIONS = [
  "alpine-reset",
  "winter-escape",
  "cinematic-weekend",
  "grand-tour",
  "alpine-bloom",
  "vineyard-valley",
  "spring-reset",
];

console.log(`\n  Rendering ${COMPOSITIONS.length} package promos...\n`);

let success = 0;
for (const id of COMPOSITIONS) {
  const outFile = resolve(OUTPUT_DIR, `${id}-promo.mp4`);
  console.log(`  [${success + 1}/${COMPOSITIONS.length}] ${id}`);

  try {
    execSync(
      `npx remotion render src/index.ts ${id} ${outFile} --codec h264`,
      {
        cwd: import.meta.dirname,
        stdio: "inherit",
        timeout: 300_000, // 5 min per render
      }
    );
    success++;
    console.log(`    → ${outFile}\n`);
  } catch (err) {
    console.error(`    ✗ Failed to render ${id}: ${err.message}\n`);
  }
}

console.log(`\n  Done! ${success}/${COMPOSITIONS.length} rendered to ${OUTPUT_DIR}\n`);
