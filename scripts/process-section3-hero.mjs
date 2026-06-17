import sharp from "sharp";

const src = "./public/images/lp/section3-hero-smartphone-couple.backup.png";
const dst = "./public/images/lp/section3-hero-smartphone-couple.png";

const CANVAS = 1254;

// 1. 背景trim
const trimBuf = await sharp(src)
  .trim({ background: { r: 244, g: 244, b: 244 }, threshold: 20 })
  .png()
  .toBuffer({ resolveWithObject: true });

const tw = trimBuf.info.width;
const th = trimBuf.info.height;
console.log(`trim後: ${tw} x ${th}`);

// 2. 円形マスク
const rx = Math.floor(tw / 2);
const ry = Math.floor(th / 2);
const maskSvg = Buffer.from(
  `<svg width="${tw}" height="${th}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${rx}" cy="${ry}" rx="${rx}" ry="${ry}" fill="white"/>
  </svg>`
);

const circled = await sharp(trimBuf.data)
  .composite([{ input: maskSvg, blend: "dest-in" }])
  .png()
  .toBuffer({ resolveWithObject: true });

// 3. 元サイズの50%にリサイズ
const targetW = Math.round(CANVAS * 0.50);
const targetH = Math.round(th * (targetW / tw));
console.log(`リサイズ後: ${targetW} x ${targetH}`);

// 4. キャンバスを円サイズに合わせる（余白なし）
//    小さな余白を4px付けて自然に
const MARGIN = 4;
const canvasW = targetW + MARGIN * 2;
const canvasH = targetH + MARGIN * 2;

const resized = await sharp(circled.data)
  .resize(targetW, targetH)
  .png()
  .toBuffer({ resolveWithObject: true });

await sharp({
  create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: resized.data, left: MARGIN, top: MARGIN }])
  .png()
  .toFile(dst);

console.log(`完了！キャンバス: ${canvasW} x ${canvasH}`);
