import sharp from "sharp";
const meta = await sharp("./public/images/lp/section-01-hero-background.png").metadata();
console.log(`Width: ${meta.width}, Height: ${meta.height}`);
