/**
 * Copies drone clips from reel-forge/output into public/ for Remotion.
 * Symlinks don't work with Remotion's bundler, so we copy.
 * Run: npm run link-clips
 */
import { readdirSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

const SOURCE = resolve(import.meta.dirname, "../reel-forge/output");
const TARGET = resolve(import.meta.dirname, "public");

if (!existsSync(TARGET)) mkdirSync(TARGET, { recursive: true });

const clips = readdirSync(SOURCE).filter((f) => f.endsWith(".mp4"));
let copied = 0;

for (const clip of clips) {
  const dest = join(TARGET, clip);
  if (!existsSync(dest)) {
    console.log(`  Copying ${clip}...`);
    copyFileSync(join(SOURCE, clip), dest);
    copied++;
  } else {
    console.log(`  Skip ${clip} (exists)`);
  }
}

console.log(`\nCopied ${copied} new clip(s). Total: ${clips.length} in public/`);
