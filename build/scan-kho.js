'use strict';
/**
 * Quét kho giáo trình trên MÁY CỦA CÔ và rút cấu trúc thật từ tên file.
 *
 * Chạy:
 *   npm run scan                                  (dùng đường dẫn mặc định)
 *   node scan-kho.js "D:\\duong\\dan\\khac"        (chỉ đường dẫn khác)
 *   set KHO_KIDSBOX=D:\...  &&  npm run scan      (Windows, đặt biến môi trường)
 *
 * Không mở, không sao chép, không gửi đi đâu nội dung sách — chỉ đọc TÊN FILE và dung lượng.
 */
const fs = require('fs');
const path = require('path');

const KHO_MAC_DINH = 'D:\\KHO-MSNGOC\\1_NOI-BO\\01_NGUON-NXB\\KIDS-BOX';
const kho = process.argv[2] || process.env.KHO_KIDSBOX || KHO_MAC_DINH;

if (!fs.existsSync(kho)) {
  console.error(`\n✗ Không thấy thư mục: ${kho}\n`);
  console.error('  Cách chỉ đường dẫn khác:');
  console.error('    node scan-kho.js "D:\\duong\\dan\\toi\\KIDS-BOX"');
  console.error('  Hoặc đặt biến môi trường KHO_KIDSBOX rồi chạy npm run scan\n');
  process.exit(1);
}

/** Đi hết cây thư mục, bỏ qua thư mục ẩn */
function duyet(dir, ra = []) {
  let muc;
  try { muc = fs.readdirSync(dir, { withFileTypes: true }); }
  catch (e) { console.warn(`  (bỏ qua, không đọc được: ${dir})`); return ra; }
  for (const m of muc) {
    if (m.name.startsWith('.')) continue;
    const p = path.join(dir, m.name);
    if (m.isDirectory()) duyet(p, ra);
    else {
      let kt = 0;
      try { kt = fs.statSync(p).size; } catch {}
      ra.push({ ten: m.name, duong: p, kt });
    }
  }
  return ra;
}

/** Rút level / unit / lesson / trang từ tên file — đúng cách cô đang đặt tên */
function bocTen(ten) {
  const T = ten.toUpperCase();
  const level = (T.match(/KID'?S?\s*BOX\s*(?:NEW\s*GENE\w*\s*)?(\d)/) || [])[1];
  const trang = (T.match(/\bP\s*(\d+)\s*[-–]\s*(\d+)/) || T.match(/\bP\s*(\d+)\b/) || []).slice(1).filter(Boolean);

  if (/REVIEW/.test(T)) {
    const us = [...T.matchAll(/(\d+)/g)].map(m => +m[1]);
    return { level, loai: 'review', nhan: 'Review', trang };
  }
  if (/MOVER/.test(T)) return { level, loai: 'movers', nhan: 'Luyện thi Movers', trang };

  const unit = (T.match(/UNIT\s*(\d+)/) || [])[1];
  const lesson = (T.match(/LESSON\s*(\d+)/) || [])[1];
  if (unit) return { level, loai: 'lesson', unit: +unit, lesson: lesson ? +lesson : null, trang };
  return { level, loai: 'khac', trang };
}

const DUOI = {
  '.pdf': 'PDF (có thể là sách)', '.pptx': 'PowerPoint', '.ppt': 'PowerPoint',
  '.rar': 'RAR (nén)', '.zip': 'ZIP (nén)', '.mp3': 'Audio', '.mp4': 'Video',
  '.docx': 'Word', '.jpg': 'Ảnh', '.png': 'Ảnh',
};
const MB = b => (b / 1048576).toFixed(1);

console.log(`\nQuét kho: ${kho}\n`);
const files = duyet(kho);
if (!files.length) { console.log('Thư mục rỗng.\n'); process.exit(0); }

// ── Tổng quan theo loại file ──
const theoLoai = {};
for (const f of files) {
  const d = path.extname(f.ten).toLowerCase();
  const nhan = DUOI[d] || (d || '(không đuôi)');
  (theoLoai[nhan] ||= { n: 0, kt: 0 });
  theoLoai[nhan].n++; theoLoai[nhan].kt += f.kt;
}
console.log(`Tổng: ${files.length} file, ${MB(files.reduce((s, f) => s + f.kt, 0))} MB\n`);
console.log('loại file                  | số file | dung lượng');
console.log('---------------------------+---------+-----------');
Object.entries(theoLoai).sort((a, b) => b[1].n - a[1].n).forEach(([k, v]) =>
  console.log(`${k.padEnd(26)} | ${String(v.n).padStart(7)} | ${MB(v.kt).padStart(8)} MB`));

// ── Ứng viên SÁCH GỐC: PDF lớn, tên không có UNIT/LESSON ──
const sach = files.filter(f => {
  const d = path.extname(f.ten).toLowerCase();
  return (d === '.pdf') && !/UNIT|LESSON|REVIEW/i.test(f.ten);
}).sort((a, b) => b.kt - a.kt);

console.log('\n── Ứng viên SÁCH GỐC (PDF, tên không có UNIT/LESSON) ──');
if (!sach.length) {
  console.log('  ✗ Không thấy PDF nào trông giống Pupil\'s Book.');
  console.log('    Nếu sách nằm trong file nén, cô giải nén ra rồi quét lại.');
} else {
  sach.slice(0, 25).forEach(f =>
    console.log(`  ${MB(f.kt).padStart(8)} MB  ${path.relative(kho, f.duong)}`));
}

// ── Cấu trúc rút từ tên file, theo từng level ──
const perLevel = {};
for (const f of files) {
  const b = bocTen(f.ten);
  if (!b.level) continue;
  const L = (perLevel[b.level] ||= { units: {}, review: [], movers: [], n: 0 });
  L.n++;
  if (b.loai === 'lesson') {
    const u = (L.units[b.unit] ||= new Set());
    if (b.lesson) u.add(b.lesson);
  } else if (b.loai === 'review') L.review.push(b.trang.join('-'));
  else if (b.loai === 'movers') L.movers.push(b.trang.join('-'));
}

console.log('\n── Cấu trúc rút từ tên file ──');
const levels = Object.keys(perLevel).sort();
if (!levels.length) {
  console.log('  Không rút được (tên file không theo mẫu KIDS BOX <n> UNIT <n> LESSON <n>).');
} else {
  for (const lv of levels) {
    const L = perLevel[lv];
    const us = Object.keys(L.units).map(Number).sort((a, b) => a - b);
    console.log(`\n  Kid's Box ${lv} — ${L.n} file`);
    if (us.length) {
      console.log(`    Unit thấy được : ${us.join(', ')}  (cao nhất: ${Math.max(...us)})`);
      const thieu = [];
      for (let i = 1; i <= Math.max(...us); i++) if (!us.includes(i)) thieu.push(i);
      console.log(`    Unit THIẾU     : ${thieu.length ? thieu.join(', ') : 'không thiếu unit nào'}`);
      const soLesson = us.map(u => L.units[u].size);
      console.log(`    Lesson mỗi unit: ${Math.min(...soLesson)}–${Math.max(...soLesson)}`);
      us.forEach(u => {
        const ls = [...L.units[u]].sort((a, b) => a - b);
        const max = ls.length ? Math.max(...ls) : 0;
        const kh = []; for (let i = 1; i <= max; i++) if (!ls.includes(i)) kh.push(i);
        if (kh.length) console.log(`      · Unit ${u}: thiếu lesson ${kh.join(', ')}`);
      });
    }
    if (L.review.length) console.log(`    Review         : ${L.review.length} file (trang ${L.review.join('; ')})`);
    if (L.movers.length) console.log(`    Luyện thi Movers: ${L.movers.length} file (trang ${L.movers.join('; ')})`);
  }
}

// ── Xuất JSON để em đọc ──
const out = path.join(__dirname, '..', 'research', 'kho-inventory.json');
fs.writeFileSync(out, JSON.stringify({
  kho, quetLuc: new Date().toISOString(),
  tongFile: files.length,
  theoLoai: Object.fromEntries(Object.entries(theoLoai).map(([k, v]) => [k, v.n])),
  ungVienSach: sach.slice(0, 40).map(f => ({ ten: f.ten, mb: +MB(f.kt), duong: path.relative(kho, f.duong) })),
  cauTruc: Object.fromEntries(levels.map(lv => [lv, {
    units: Object.fromEntries(Object.entries(perLevel[lv].units)
      .map(([u, s]) => [u, [...s].sort((a, b) => a - b)])),
    review: perLevel[lv].review, movers: perLevel[lv].movers,
  }])),
}, null, 2), 'utf8');

console.log(`\n✅ Đã ghi: ${out}`);
console.log('   Cô gửi file này cho em (kéo vào khung chat) là em biết kho có đúng những gì.\n');
