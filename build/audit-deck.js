'use strict';
/**
 * Soi trực tiếp file .pptx đã xuất (không phải soi code dựng nó) để kiểm tra
 * checklist bắt buộc của `deck-elite`. Giải nén XML và đọc giá trị thật.
 *
 * Dùng: node audit-deck.js ../slides/<file>.pptx
 */
const { execSync } = require('child_process');
const path = require('path');
const B = require('./brand.js');

const EMU = 914400;                 // EMU mỗi inch
const PAGE = { w: 13.333, h: 7.5, margin: 0.6 };
const GOLD = 'C9A227', BURGUNDY = '7B2233', NAVY = '0F2A4A';
const LIGHT_BG = new Set(['FFFFFF', 'F5F2EA']);

const file = path.resolve(process.argv[2]);
const names = execSync(`unzip -Z1 "${file}" 'ppt/slides/slide*.xml'`, { encoding: 'utf8' })
  .trim().split('\n')
  .sort((a, b) => (+a.match(/slide(\d+)/)[1]) - (+b.match(/slide(\d+)/)[1]));

const problems = [];
const hardDiacritics = new Set();
const report = [];

for (const name of names) {
  const no = +name.match(/slide(\d+)/)[1];
  const xml = execSync(`unzip -p "${file}" "${name}"`, { encoding: 'utf8', maxBuffer: 1 << 26 });

  // nền slide
  const bgM = xml.match(/<p:bg>.*?<a:srgbClr val="([0-9A-Fa-f]{6})"/s);
  const bg = bgM ? bgM[1].toUpperCase() : 'FFFFFF(mặc định)';
  const bgIsLight = LIGHT_BG.has(bg.replace('(mặc định)', ''));

  // Tách theo từng KHỐI (<p:sp>) để biết chữ nằm trên nền gì — không đoán theo cả slide
  const shapes = [...xml.matchAll(/<p:sp>(.*?)<\/p:sp>/gs)].map(m => {
    const b = m[1];
    const off = b.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/><a:ext cx="(\d+)" cy="(\d+)"\/>/);
    const spPr = (b.match(/<p:spPr>(.*?)<\/p:spPr>/s) || [])[1] || '';
    const fill = (spPr.match(/<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"/) || [])[1]?.toUpperCase() || null;
    const runs = [...b.matchAll(/<a:rPr[^>]*?\bsz="(\d+)"[^>]*?>(.*?)<\/a:rPr>\s*<a:t>(.*?)<\/a:t>/gs)]
      .map(r => ({
        pt: +r[1] / 100,
        color: (r[2].match(/<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"/) || [])[1]?.toUpperCase() || null,
        text: r[3].replace(/&amp;/g, '&').slice(0, 40),
      }));
    return {
      fill, runs,
      x: off ? +off[1] / EMU : 0, y: off ? +off[2] / EMU : 0,
      w: off ? +off[3] / EMU : 0, h: off ? +off[4] / EMU : 0,
    };
  });

  const runs = shapes.flatMap(sp => sp.runs);
  const frames = shapes.map(sp => ({ x: sp.x, y: sp.y, w: sp.w, h: sp.h }));
  const navyBlocks = shapes.filter(sp => sp.fill === NAVY);
  const inside = (a, b) => a.x >= b.x - 0.02 && a.y >= b.y - 0.02 &&
                           a.x + a.w <= b.x + b.w + 0.02 && a.y + a.h <= b.y + b.h + 0.02;

  // ── Luật 3: sàn cỡ chữ ──
  runs.filter(r => r.pt < 16).forEach(r =>
    problems.push(`slide ${no}: chữ ${r.pt}pt < sàn tuyệt đối 16pt — "${r.text}"`));
  const small = runs.filter(r => r.pt >= 16 && r.pt < 24);

  // ── D2 (stop-slop): deck Kids — chữ HỌC VIÊN đọc phải ≥ 24pt.
  // Chữ dành cho GIÁO VIÊN (nhãn stage, footer, ô chờ ảnh/audio) được phép 18pt
  // theo deck-elite ("nhãn phụ, chú thích 18pt"). Phân biệt bằng nội dung + màu.
  const isChrome = B.laChuChoCo;
  // Slide 1 (P01 Cover) được miễn: dòng phụ trên bìa là thông tin cho giáo viên,
  // không phải nội dung bé đọc. deck-elite cũng miễn slide bìa khỏi Luật 1.
  runs.filter(r => no !== 1 && !isChrome(r) && r.pt < 24).forEach(r =>
    problems.push(`slide ${no}: chữ HỌC VIÊN đọc chỉ ${r.pt}pt < 24pt (sàn deck Kids) — "${r.text}"`));

  // ── D5: dấu tiếng Việt khó — ghi nhận để kiểm bằng mắt trên ảnh render ──
  runs.forEach(r => { if (/[ếữợẳẫệớ]/.test(r.text)) hardDiacritics.add(r.text.trim()); });

  // ── Gold làm chữ: chỉ hợp lệ khi khối chữ NẰM LỌT trong một khối Navy, hoặc nền slide là Navy ──
  shapes.forEach(sp => {
    sp.runs.filter(r => r.color === GOLD).forEach(r => {
      const onNavy = !bgIsLight || sp.fill === NAVY || navyBlocks.some(nb => inside(sp, nb));
      if (!onNavy) {
        problems.push(`slide ${no}: chữ Gold KHÔNG nằm trên nền Navy (nền ${bg}) — "${r.text}"`);
      }
    });
  });

  // ── Burgundy tối đa 1 lần/slide ──
  const burgundyCount = (xml.match(new RegExp(`<a:srgbClr val="${BURGUNDY}"`, 'g')) || []).length;
  if (burgundyCount > 1) {
    problems.push(`slide ${no}: Burgundy xuất hiện ${burgundyCount} lần (tối đa 1)`);
  }

  // ── Chồng lấn: hai khối CÙNG CÓ CHỮ không được đè nhau (khối chữ nằm trên nền màu là cố ý) ──
  const textShapes = shapes.filter(sp => sp.runs.length && sp.w > 0 && sp.h > 0);
  for (let i = 0; i < textShapes.length; i++) {
    for (let j = i + 1; j < textShapes.length; j++) {
      const a = textShapes[i], b2 = textShapes[j];
      const ox = Math.min(a.x + a.w, b2.x + b2.w) - Math.max(a.x, b2.x);
      const oy = Math.min(a.y + a.h, b2.y + b2.h) - Math.max(a.y, b2.y);
      if (ox > 0.05 && oy > 0.05) {
        problems.push(`slide ${no}: hai khối chữ ĐÈ NHAU (${ox.toFixed(2)}x${oy.toFixed(2)} in) — `
          + `"${a.runs[0]?.text}" ↔ "${b2.runs[0]?.text}"`);
      }
    }
  }

  // ── Lề an toàn 0.6in — bỏ qua các khối cố ý tràn mép (thanh Gold, nền full-bleed) ──
  frames.forEach(f => {
    const fullBleed = f.w >= PAGE.w - 0.01 || (f.x <= 0.001 && f.w <= 0.2);
    if (fullBleed) return;
    if (f.x < PAGE.margin - 0.01 || f.y < 0.3 ||
        f.x + f.w > PAGE.w - PAGE.margin + 0.01 || f.y + f.h > PAGE.h - 0.3) {
      problems.push(`slide ${no}: khối vượt lề an toàn — x=${f.x.toFixed(2)} y=${f.y.toFixed(2)} `
        + `w=${f.w.toFixed(2)} h=${f.h.toFixed(2)}`);
    }
  });

  // ── Tràn khỏi mặt slide ──
  frames.forEach(f => {
    if (f.x + f.w > PAGE.w + 0.01 || f.y + f.h > PAGE.h + 0.01) {
      problems.push(`slide ${no}: khối TRÀN khỏi mặt slide`);
    }
  });

  report.push({ no, bg, runs: runs.length, frames: frames.length, burgundyCount,
    sizes: [...new Set(runs.map(r => r.pt))].sort((a, b) => b - a), small: small.length });
}

console.log(`\nSoi file: ${path.basename(file)} — ${names.length} slide\n`);
console.log('slide | nền     | #chữ | #khối | cỡ chữ dùng (pt)           | 16–23pt');
console.log('------+---------+------+-------+----------------------------+--------');
report.forEach(r => console.log(
  `  ${String(r.no).padStart(3)} | ${r.bg.slice(0, 7).padEnd(7)} | ${String(r.runs).padStart(4)} | `
  + `${String(r.frames).padStart(5)} | ${r.sizes.join(', ').slice(0, 26).padEnd(26)} | ${r.small}`));

console.log('\n── Kết quả checklist deck-elite ──');
if (problems.length === 0) {
  console.log('✅ Không phát hiện vi phạm: cỡ chữ, màu Gold, Burgundy, lề an toàn, tràn slide.');
} else {
  console.log(`❌ ${problems.length} vấn đề:`);
  problems.forEach(p => console.log('   · ' + p));
  process.exitCode = 1;
}
console.log('\nGhi chú: cỡ 16–23pt chỉ dành cho chữ GIÁO VIÊN đọc (nhãn stage, footer, ô chờ ảnh).');
console.log('Chữ HỌC VIÊN đọc đã được kiểm riêng: phải ≥ 24pt.\n');
if (hardDiacritics.size) {
  console.log('── D5: chuỗi chứa dấu tiếng Việt khó — phải soi bằng mắt trên ảnh render ──');
  [...hardDiacritics].forEach(t => console.log(`   · "${t}"`));
  console.log('');
}
