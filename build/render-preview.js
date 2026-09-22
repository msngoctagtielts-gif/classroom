'use strict';
/**
 * Render file .pptx ĐÃ XUẤT ra ảnh PNG để nhìn bằng mắt (checklist deck-elite).
 * Đọc thẳng XML trong file, dựng lại từng khối theo đúng tọa độ inch → HTML → Chromium chụp ảnh.
 *
 * Lưu ý trung thực: đây là bản dựng lại hình học từ XML, KHÔNG phải ảnh do PowerPoint render.
 * Môi trường này không có LibreOffice Impress nên không convert PPTX trực tiếp được.
 * Bản dựng này kiểm chứng được: vị trí, kích thước, màu, cỡ chữ, chồng lấn, tràn lề.
 * Nó KHÔNG kiểm chứng được: cách PowerPoint ngắt dòng và thay thế font.
 *
 * Dùng: node render-preview.js <file.pptx> <thư mục ảnh> [slide,slide,...]
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const EMU = 914400, DPI = 110;
const file = path.resolve(process.argv[2]);
const outDir = path.resolve(process.argv[3]);
const want = process.argv[4] ? new Set(process.argv[4].split(',').map(Number)) : null;
fs.mkdirSync(outDir, { recursive: true });

const dec = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"').replace(/&apos;/g, "'");
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const names = execSync(`unzip -Z1 "${file}" 'ppt/slides/slide*.xml'`, { encoding: 'utf8' })
  .trim().split('\n').sort((a, b) => (+a.match(/slide(\d+)/)[1]) - (+b.match(/slide(\d+)/)[1]));

function buildSlide(xml) {
  const bg = (xml.match(/<p:bg>.*?<a:srgbClr val="([0-9A-Fa-f]{6})"/s) || [])[1] || 'FFFFFF';
  const parts = [];
  for (const m of xml.matchAll(/<p:sp>(.*?)<\/p:sp>/gs)) {
    const b = m[1];
    const off = b.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/><a:ext cx="(\d+)" cy="(\d+)"\/>/);
    if (!off) continue;
    const [x, y, w, h] = [off[1], off[2], off[3], off[4]].map(v => +v / EMU * DPI);

    const spPr = (b.match(/<p:spPr>(.*?)<\/p:spPr>/s) || [])[1] || '';
    const fill = (spPr.match(/<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"/) || [])[1];
    const line = (spPr.match(/<a:ln[^>]*>.*?<a:srgbClr val="([0-9A-Fa-f]{6})"/s) || [])[1];
    const dashed = /dash/i.test(spPr);
    const round = /roundRect/.test(spPr);

    const bodyPr = (b.match(/<a:bodyPr[^>]*>/) || [''])[0];
    const valign = /anchor="ctr"/.test(bodyPr) ? 'center' : /anchor="b"/.test(bodyPr) ? 'flex-end' : 'flex-start';
    const align = /algn="ctr"/.test(b) ? 'center' : /algn="r"/.test(b) ? 'right' : 'left';

    const runs = [...b.matchAll(/<a:rPr[^>]*?\bsz="(\d+)"[^>]*?>(.*?)<\/a:rPr>\s*<a:t>(.*?)<\/a:t>/gs)]
      .map(r => {
        const pt = +r[1] / 100;
        const col = (r[2].match(/<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"/) || [])[1] || '1A1A1A';
        const bold = /\bb="1"/.test(r[0]);
        const ital = /\bi="1"/.test(r[0]);
        return `<span style="font-size:${pt / 72 * DPI}px;color:#${col};`
             + `font-weight:${bold ? 700 : 400};font-style:${ital ? 'italic' : 'normal'}">`
             + `${esc(dec(r[3]))}</span>`;
      }).join('');

    const style = [
      `left:${x}px`, `top:${y}px`, `width:${w}px`, `height:${h}px`,
      fill ? `background:#${fill}` : '',
      line ? `border:2px ${dashed ? 'dashed' : 'solid'} #${line}` : '',
      round ? 'border-radius:11px' : '',
      `justify-content:${valign}`, `text-align:${align}`,
    ].filter(Boolean).join(';');
    parts.push(`<div class="sp" style="${style}"><div class="tx">${runs}</div></div>`);
  }
  return { bg, html: parts.join('') };
}

(async () => {
  // Image có sẵn Chromium; dùng thẳng, không tải browser mới.
  // Ghi đè được bằng biến môi trường CHROMIUM_PATH.
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
  const page = await browser.newPage({
    viewport: { width: Math.round(13.333 * DPI), height: Math.round(7.5 * DPI) },
    deviceScaleFactor: 2,
  });
  const saved = [];
  for (const name of names) {
    const no = +name.match(/slide(\d+)/)[1];
    if (want && !want.has(no)) continue;
    const xml = execSync(`unzip -p "${file}" "${name}"`, { encoding: 'utf8', maxBuffer: 1 << 26 });
    const { bg, html } = buildSlide(xml);
    await page.setContent(`<!doctype html><meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Be+Vietnam+Pro:ital,wght@0,400;0,700;1,400&display=swap');
        html,body{margin:0;padding:0}
        body{width:${13.333 * DPI}px;height:${7.5 * DPI}px;background:#${bg};
             font-family:'Be Vietnam Pro',Calibri,sans-serif;overflow:hidden}
        .sp{position:absolute;display:flex;flex-direction:column;box-sizing:border-box}
        .tx{white-space:pre-wrap;line-height:1.15;width:100%}
      </style>${html}`, { waitUntil: 'networkidle' });
    const out = path.join(outDir, `slide-${String(no).padStart(2, '0')}.png`);
    await page.screenshot({ path: out });
    saved.push(out);
  }
  await browser.close();
  console.log(saved.join('\n'));
})();
