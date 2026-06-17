import sharp from "sharp";

const src = "./public/images/lp/section3-hero-smartphone-couple.png";
const meta = await sharp(src).metadata();
console.log(`Width: ${meta.width}, Height: ${meta.height}, Format: ${meta.format}`);
