import sharp from "sharp";

const src = "./public/images/lp/section3-hero-smartphone-couple.backup.png";

// 左上1x1ピクセルを取得
const { data } = await sharp(src)
  .extract({ left: 0, top: 0, width: 1, height: 1 })
  .raw()
  .toBuffer({ resolveWithObject: true });

console.log(`左上ピクセル RGB: r=${data[0]}, g=${data[1]}, b=${data[2]}`);

// 右下1x1ピクセル
const { data: data2 } = await sharp(src)
  .extract({ left: 1253, top: 1253, width: 1, height: 1 })
  .raw()
  .toBuffer({ resolveWithObject: true });

console.log(`右下ピクセル RGB: r=${data2[0]}, g=${data2[1]}, b=${data2[2]}`);
