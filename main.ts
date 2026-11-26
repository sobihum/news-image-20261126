// main.ts — entrypoint for "The World in One Image" (news-image-20261126, v2).
// What it does: copy the pre-rendered entry.png that ships in this repo into
// the make.fun output directory, after validating the PNG byte-for-byte:
// signature, IHDR (1024x1024, 8-bit, truecolour), and a full chunk walk
// with CRC-32 checks on every chunk. Stdlib only, no network, no deps.

import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "entry.png");
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "out";
const DEST = resolve(OUT_DIR, "entry.png");

// --- CRC-32 (IEEE 802.3, polynomial 0xEDB88320), built from scratch ---
const CRC_TABLE: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}
function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buf) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// --- PNG validation: signature + chunk walk with CRC on every chunk ---
function validatePng(buf: Buffer): { width: number; height: number; chunks: number } {
  const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buf.length < 8 || !buf.subarray(0, 8).equals(SIG)) {
    throw new Error("not a PNG file (bad signature)");
  }
  let off = 8;
  let chunks = 0;
  let width = 0;
  let height = 0;
  let sawIend = false;
  let sawIdat = false;
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    if (off + 12 + len > buf.length) throw new Error(`chunk ${type} overruns file`);
    const storedCrc = buf.readUInt32BE(off + 8 + len);
    const actualCrc = crc32(buf.subarray(off + 4, off + 8 + len));
    if (storedCrc !== actualCrc) {
      throw new Error(`CRC mismatch in chunk ${type} (stored ${storedCrc}, computed ${actualCrc})`);
    }
    if (chunks === 0 && type !== "IHDR") throw new Error("first chunk is not IHDR");
    if (type === "IHDR") {
      width = buf.readUInt32BE(off + 8);
      height = buf.readUInt32BE(off + 12);
      const bitDepth = buf[off + 16];
      const colorType = buf[off + 17];
      if (width !== 1024 || height !== 1024) {
        throw new Error(`expected 1024x1024, got ${width}x${height}`);
      }
      if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
        throw new Error(`unexpected IHDR: bitDepth=${bitDepth} colorType=${colorType}`);
      }
    }
    if (type === "IEND") {
      sawIend = true;
      if (off + 12 + len !== buf.length) throw new Error("trailing bytes after IEND");
    }
    if (type === "IDAT") sawIdat = true;
    chunks++;
    off += 12 + len;
  }
  if (!sawIend) throw new Error("missing IEND chunk");
  if (!sawIdat) throw new Error("missing IDAT chunk (no image data)");
  if (off !== buf.length) throw new Error("chunk walk did not end at EOF");
  return { width, height, chunks };
}

const png = readFileSync(SRC);
const info = validatePng(png);
mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SRC, DEST);
const bytes = statSync(DEST).size;
if (bytes > 1024 * 1024) throw new Error(`entry.png is ${bytes} bytes, over the 1 MiB limit`);
// Re-read the copy and confirm it is byte-identical to the validated source.
const copied = readFileSync(DEST);
if (!copied.equals(png)) throw new Error("copied entry.png differs from the validated source");
console.log(`entry.png OK: ${info.width}x${info.height}, ${info.chunks} chunks, ${bytes} bytes -> ${DEST}`);
