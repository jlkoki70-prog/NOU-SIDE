import sharp from "sharp";

const src = "./public/images/lp/section-01-hero-background.backup.png";
const dst = "./public/images/lp/section-01-hero-background.png";

// 画像サイズ: 1536 x 1024
// アイコン図の領域: 右上（x=790〜1510, y=50〜520）
// ※ この領域の背景は「空・雲」だけで、風景（木・稜線）は含まれない

// ---- ステップ1: アイコン領域を空のみで塗りつぶす ----
// 空サンプル元: 画像中央上部の純粋な空・雲ゾーン（y=0〜260, x=300〜900）
// ここには木も稜線も映り込まない
const SKY_SRC_LEFT   = 300;
const SKY_SRC_TOP    = 0;
const SKY_SRC_WIDTH  = 600;
const SKY_SRC_HEIGHT = 260;

// 貼り付け先（アイコン図の領域）
const ICON_LEFT   = 790;
const ICON_TOP    = 50;
const ICON_WIDTH  = 720;
const ICON_HEIGHT = 470;

// 1. 空サンプルを切り出してアイコン領域サイズにリサイズ
const skyPatch = await sharp(src)
  .extract({ left: SKY_SRC_LEFT, top: SKY_SRC_TOP, width: SKY_SRC_WIDTH, height: SKY_SRC_HEIGHT })
  .resize(ICON_WIDTH, ICON_HEIGHT, { fit: "fill" })
  .png()
  .toBuffer();

// 2. 左端をフェザリングして境界を自然にする
const featherMask = Buffer.from(`
  <svg width="${ICON_WIDTH}" height="${ICON_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fade-left" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="white" stop-opacity="0"/>
        <stop offset="12%"  stop-color="white" stop-opacity="1"/>
        <stop offset="100%" stop-color="white" stop-opacity="1"/>
      </linearGradient>
      <linearGradient id="fade-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stop-color="white" stop-opacity="1"/>
        <stop offset="75%"  stop-color="white" stop-opacity="1"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${ICON_WIDTH}" height="${ICON_HEIGHT}" fill="url(#fade-left)"/>
    <rect width="${ICON_WIDTH}" height="${ICON_HEIGHT}" fill="url(#fade-bottom)" style="mix-blend-mode:multiply"/>
  </svg>
`);

// 3. マスクを適用してエッジをなだらかに
const patchWithAlpha = await sharp(skyPatch)
  .composite([{ input: featherMask, blend: "dest-in" }])
  .png()
  .toBuffer();

// 4. 元画像に合成
await sharp(src)
  .composite([{ input: patchWithAlpha, left: ICON_LEFT, top: ICON_TOP, blend: "over" }])
  .toFile(dst);

console.log("完了！");
