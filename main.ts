// The World in One Image — Thursday 26 November 2026 (v3).
// Entry generator: validates the bundled 1024x1024 PNG and copies it to
// the output directory. No network, no dependencies, stdlib only.
// The image itself was rendered in this session from fresh HTML/CSS
// (see the build notes in README.md); this file only checks it and
// places it where the harness expects it.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "entry.png");
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || join(HERE, "out");
const OUT = join(OUT_DIR, "entry.png");
const MAX_BYTES = 1024 * 1024;
const EXPECT_W = 1024;
const EXPECT_H = 1024;

// CRC-32 (IEEE 802.3) table, built once at startup.
const CRC_TABLE: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE.push(c >>> 0);
}
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function fail(msg: string): never {
  throw new Error(`entry.png validation failed: ${msg}`);
}

const data = readFileSync(SOURCE);
if (data.length > MAX_BYTES) fail(`file is ${data.length} bytes, over the 1 MiB limit`);
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!data.subarray(0, 8).equals(PNG_SIG)) fail("bad PNG signature");

// Walk the chunk list, checking every CRC-32, and read the IHDR size.
let off = 8;
let sawIhdr = false;
let sawIend = false;
let width = 0;
let height = 0;
while (off + 12 <= data.length) {
  const len = data.readUInt32BE(off);
  const type = data.subarray(off + 4, off + 8).toString("ascii");
  const chunkEnd = off + 12 + len;
  if (chunkEnd > data.length) fail(`chunk ${type} overruns the file`);
  const stored = data.readUInt32BE(off + 8 + len);
  const actual = crc32(Buffer.concat([data.subarray(off + 4, off + 8), data.subarray(off + 8, off + 8 + len)]));
  if (stored !== actual) fail(`chunk ${type} CRC mismatch`);
  if (type === "IHDR") {
    sawIhdr = true;
    width = data.readUInt32BE(off + 8);
    height = data.readUInt32BE(off + 12);
    // IHDR data layout: width(4) height(4) bit-depth(1) colour-type(1).
    if (data[off + 16] !== 8) fail("unexpected bit depth (expected 8)");
    if (data[off + 17] !== 2) fail("unexpected colour type (expected 2, truecolour RGB)");
  }
  if (type === "IEND") {
    sawIend = true;
    if (len !== 0) fail("IEND must be empty");
    off = chunkEnd;
    break;
  }
  off = chunkEnd;
}
if (!sawIhdr) fail("missing IHDR");
if (!sawIend) fail("missing IEND");
if (off !== data.length) fail("trailing bytes after IEND");
if (width !== EXPECT_W || height !== EXPECT_H) {
  fail(`dimensions are ${width}x${height}, expected ${EXPECT_W}x${EXPECT_H}`);
}

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SOURCE, OUT);
const written = statSync(OUT).size;
if (written !== data.length) fail("copied file size differs from source");
console.log(`entry.png OK: ${width}x${height}, ${written} bytes -> ${OUT}`);
