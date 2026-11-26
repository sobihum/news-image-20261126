// main.ts — news-image-20261126 entry program (Node 22, standard library only).
//
// The entry image is built ahead of time and shipped in this repository as
// entry.png. This program validates that file and copies it byte-for-byte to
// the output directory, so both grader runs produce identical bytes.
//
// Usage:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Output: $MAKEFUN_OUTPUT_DIR/entry.png (default /output/entry.png)

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// CRC-32 (IEEE 802.3, polynomial 0xEDB88320), built at load time.
const CRC_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Walk every PNG chunk, checking its CRC and structure:
// [length:4][type:4][data:length][crc:4], first chunk IHDR, last chunk IEND.
function validateChunkWalk(bytes: Buffer): void {
  let offset = 8; // past the signature
  let first = true;
  let sawIend = false;
  while (offset < bytes.length) {
    if (offset + 8 > bytes.length) fail("entry.png ends mid-chunk header");
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    if (offset + 12 + length > bytes.length) fail(`entry.png chunk ${type} is truncated`);
    const storedCrc = bytes.readUInt32BE(offset + 8 + length);
    const actualCrc = crc32(bytes.subarray(offset + 4, offset + 8 + length));
    if (storedCrc !== actualCrc) {
      fail(`entry.png chunk ${type} has a bad CRC (stored ${storedCrc}, computed ${actualCrc})`);
    }
    if (first && type !== "IHDR") fail("entry.png first chunk is not IHDR");
    first = false;
    offset += 12 + length;
    if (type === "IEND") {
      sawIend = true;
      break;
    }
  }
  if (!sawIend) fail("entry.png has no IEND chunk");
  if (offset !== bytes.length) fail("entry.png has trailing bytes after IEND");
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1024 * 1024; // 1 MiB
const EXPECTED_WIDTH = 1024;
const EXPECTED_HEIGHT = 1024;

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// The image lives next to this file in the repository, wherever it is run from.
const repoDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(repoDir, "entry.png");

let bytes: Buffer;
try {
  bytes = readFileSync(sourcePath);
} catch {
  fail(`cannot read ${sourcePath} — entry.png is missing from the repository`);
}

// 1. Size cap.
if (bytes.length > MAX_BYTES) {
  fail(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}

// 2. PNG signature (first 8 bytes).
if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
  fail("entry.png does not start with the PNG signature");
}

// 3. IHDR chunk: length 13, type IHDR, then width and height (big-endian).
if (bytes.length < 33 || bytes.readUInt32BE(8) !== 13 || bytes.toString("ascii", 12, 16) !== "IHDR") {
  fail("entry.png has no valid IHDR chunk");
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
  fail(`entry.png is ${width}x${height}, expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`);
}

// 3b. Full chunk walk: every chunk's CRC must check out, ending at IEND.
validateChunkWalk(bytes);

// 4. Write the exact bytes to the output directory.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, bytes);
console.log(`main.ts: wrote ${bytes.length} bytes to ${outPath}`);
