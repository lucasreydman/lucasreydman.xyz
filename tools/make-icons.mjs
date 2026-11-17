/**
 * Build the favicon set from a single square source.
 *
 *   node tools/make-icons.mjs ~/Downloads/monogram.png
 *
 * Writes app/icon.png, app/apple-icon.png and app/favicon.ico. Next's App Router
 * picks those filenames up on its own and emits the link tags, so nothing in
 * layout.tsx needs to reference them.
 *
 * Sharp cannot write .ico, so the container is assembled here. An ICO is a tiny
 * header plus a directory, and since Vista each entry is allowed to hold a whole
 * PNG rather than a raw bitmap, which is what this does.
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const source = process.argv[2];
if (!source) {
  console.error("usage: node tools/make-icons.mjs <source.png>");
  process.exit(1);
}

const APP = path.join(process.cwd(), "app");

/* A monogram at 16 pixels is four or five strokes wide. The downscale softens
   the letterforms to the point of illegibility, so the small sizes get the bite
   put back the same way the screenshot plates do. */
async function png(size, sharpen) {
  let pipe = sharp(source).resize(size, size, { kernel: "lanczos3", fit: "cover" });
  if (sharpen) pipe = pipe.sharpen({ sigma: 0.6, m1: 0.4, m2: 2 });
  /* Next reads these at build time to fill in the link tags and rejects a PNG
     without an alpha channel outright ("The PNG is not in RGBA format!"). The
     monogram source is fully opaque, so the channel has to be added. */
  return pipe.ensureAlpha().png({ compressionLevel: 9 }).toBuffer();
}

function ico(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(count, 4);

  const directory = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;

  images.forEach(({ size, data }, i) => {
    const at = i * 16;
    directory.writeUInt8(size >= 256 ? 0 : size, at + 0); // 0 means 256
    directory.writeUInt8(size >= 256 ? 0 : size, at + 1);
    directory.writeUInt8(0, at + 2); // palette size
    directory.writeUInt8(0, at + 3); // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(data.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...images.map((i) => i.data)]);
}

const meta = await sharp(source).metadata();
if (meta.width !== meta.height) {
  console.warn(
    `! source is ${meta.width}x${meta.height}, not square. It will be centre-cropped.`
  );
}

/* The two standalone PNGs go out as 256-colour palettes. The 512 was 279 KB
   in truecolour, fetched by every first visit; as a palette it is 145 KB and no
   channel moves by more than 3 of 255. The ICO keeps truecolour RGBA, which is
   the format the check quoted above is about. */
const compact = (buf) =>
  sharp(buf).png({ compressionLevel: 9, palette: true, effort: 10 }).toBuffer();
await writeFile(path.join(APP, "icon.png"), await compact(await png(512, false)));
await writeFile(path.join(APP, "apple-icon.png"), await compact(await png(180, false)));

const icoSizes = [16, 32, 48];
const packed = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await png(size, size <= 32) }))
);
await writeFile(path.join(APP, "favicon.ico"), ico(packed));

console.log(`source          ${meta.width}x${meta.height}`);
console.log(`app/icon.png       512x512`);
console.log(`app/apple-icon.png 180x180`);
console.log(`app/favicon.ico    ${icoSizes.join(", ")} (embedded PNG)`);
