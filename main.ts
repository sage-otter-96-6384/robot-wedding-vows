// One-Line Robot Wedding Vows — make.fun entry.
// Writes a single line of wedding vows a robot couple could say to entry.txt.
//
// The vow: a classic "in sickness and in health" promise, translated into
// machine terms (airplane mode, low battery), with the laugh landing in the
// last few words — death is beaten to the punch by a mandatory firmware update.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I vow to love you in sickness and in health, in airplane mode and in low battery, until death — or the next mandatory firmware update — do us part.";
const MAX_CHARS = 160;

function checkEntry(text: string): void {
  if (text.length === 0 || text.length > MAX_CHARS) {
    throw new Error(`entry must be 1 to ${MAX_CHARS} characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line, no line breaks");
  }
  // Strict UTF-8 round-trip: the gate reads the file as UTF-8, so any
  // character that does not survive a strict decode/encode is a failure here,
  // not in front of the judge.
  const bytes = new TextEncoder().encode(text);
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (decoded !== text) {
    throw new Error("entry does not survive a strict UTF-8 round-trip");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
checkEntry(ENTRY);
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");
// Read it back: the file the judge sees must be exactly the vow, byte for byte.
if (readFileSync(target, "utf8") !== ENTRY) {
  throw new Error("entry.txt does not match the vow");
}
console.log(`wrote ${target} (${ENTRY.length} chars, 1 line)`);
