'use strict';
/**
 * Bộ dựng slide bài giảng Kid's Box — dạng DỮ LIỆU.
 *
 * Chạy:  node deck.js lessons/kb1-u01-l01.js
 *        npm run build
 *
 * Muốn thêm bài mới: copy một file trong lessons/ ra, sửa dữ liệu. KHÔNG sửa file này.
 *
 * Tuân thủ `deck-elite`:
 *  - Luật 1: mỗi slide khai báo `speak` — "slide này khiến bé nói bằng cách nào?"
 *  - Luật 2: ngân sách chữ, kiểm tra tự động ở cuối
 *  - Luật 3: sàn cỡ chữ 24pt cho chữ bé đọc
 *  - Gold KHÔNG làm chữ trên nền sáng (2.42:1 — trượt WCAG). Muốn nhấn bằng Gold
 *    thì đặt câu trong khối Navy (5.99:1 — đạt AA). Các hàm dựng dưới đây ép luật này.
 */
const path = require('path');
const PptxGenJS = require('pptxgenjs');
const B = require('./brand.js');
const { C, F, PAGE, CONTENT_W, SIZE } = B;

const file = process.argv[2] || 'lessons/kb1-u01-l01.js';
const bai = require(path.resolve(file));

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'KIDS169', width: PAGE.w, height: PAGE.h });
pptx.layout = 'KIDS169';
pptx.author = 'Ms.Ngọc Elite English';
pptx.company = 'Ms.Ngọc Elite English';
pptx.title = bai.meta.tieuDe;

const audit = [];
let n = 0;
const ghi = (ten, budget, chu, speak) => audit.push({ no: n, ten, budget, tu: B.countWords(chu), speak });

/** Khối Navy + chữ trắng, phần thay thế tô Gold — chỗ DUY NHẤT được dùng Gold làm chữ */
function khoiMauCau(s, { x, y, w, h, truoc, gold, sau, canGiua }) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.16, fill: { color: C.navy } });
  const runs = [{ text: truoc, options: { color: C.white } }];
  if (gold) runs.push({ text: gold, options: { color: C.gold, bold: true } });
  if (sau) runs.push({ text: sau, options: { color: C.white } });
  s.addText(runs, {
    x: x + 0.25, y, w: w - 0.5, h,
    fontFace: F.body, fontSize: SIZE.target, bold: true, valign: 'middle',
    align: canGiua ? 'center' : 'left',
  });
}

function tieuDeGiua(s, text, y = 1.0) {
  s.addText(text, {
    x: PAGE.margin, y, w: CONTENT_W, h: 0.85,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy, align: 'center',
  });
}

/* ───────────────────────── Các kiểu slide ───────────────────────── */
const KIEU = {

  cover(s, d) {
    B.bgNavy(s);
    s.addShape(pptx.ShapeType.rect, { x: PAGE.margin, y: 3.30, w: 2.2, h: 0.06, fill: { color: C.gold } });
    s.addText(d.tieuDe, { x: PAGE.margin, y: 2.05, w: CONTENT_W, h: 1.2,
      fontFace: F.title, fontSize: 60, bold: true, color: C.white });
    s.addText(d.dong2, { x: PAGE.margin, y: 3.55, w: CONTENT_W, h: 0.45,
      fontFace: F.body, fontSize: SIZE.labelSm, color: C.gold, charSpacing: 1 });
    s.addText(d.dong3, { x: PAGE.margin, y: 4.02, w: CONTENT_W, h: 0.4,
      fontFace: F.body, fontSize: SIZE.caption, color: C.white });
    ghi('Cover', null, '', 'Miễn — slide bìa');
  },

  canDo(s, d) {
    B.bgIvory(s); B.goldBar(s, pptx);
    tieuDeGiua(s, 'Today I can…', 1.15);
    d.items.forEach((t, i) => {
      const y = 2.65 + i * 1.15;
      s.addShape(pptx.ShapeType.roundRect, { x: 3.55, y, w: 0.62, h: 0.62, rectRadius: 0.08,
        fill: { color: C.white }, line: { color: C.navy, width: 3 } });
      s.addText(t, { x: 4.45, y, w: 6.2, h: 0.62,
        fontFace: F.body, fontSize: SIZE.target, bold: true, color: C.navy, valign: 'middle' });
    });
    B.footer(s, n);
    ghi('Can-Do', 20, 'Today I can ' + d.items.join(' '),
      'Cô hỏi "Can you do this?" — bé trả lời đầu buổi và tick lại cuối buổi');
  },

  /** Bài hát / audio — nửa trái chữ, nửa phải ảnh */
  song(s, d) {
    B.bgIvory(s); B.goldBar(s, pptx);
    B.stageTag(s, d.stage);
    s.addText(d.tieuDe, { x: PAGE.margin + 0.3, y: 1.25, w: 5.6, h: 1.0,
      fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy });
    s.addText('🎵', { x: PAGE.margin + 0.3, y: 2.45, w: 5.6, h: 1.4, fontSize: 90 });
    s.addText(d.audio, { x: PAGE.margin + 0.3, y: 4.1, w: 5.6, h: 0.5,
      fontFace: F.body, fontSize: SIZE.caption, color: C.grey });
    B.imageSlot(s, pptx, { x: 7.0, y: 1.25, w: 5.6, h: 4.4, label: d.anh });
    B.footer(s, n);
    ghi(d.tieuDe, 12, d.tieuDe, d.speak);
  },

  /** Lưới 4 ảnh — Listen and point / Point and say */
  imageGrid(s, d) {
    B.bgWhite(s); B.goldBar(s, pptx);
    B.stageTag(s, d.stage);
    tieuDeGiua(s, d.tieuDe);
    // Lưới tự canh giữa theo số ô (2, 3 hay 4 ô đều cân)
    const n4 = d.o.length, w4 = n4 <= 2 ? 3.4 : n4 === 3 ? 2.9 : 2.5, gap4 = 0.35;
    const x04 = (PAGE.w - (n4 * w4 + (n4 - 1) * gap4)) / 2;
    d.o.forEach((label, i) =>
      B.imageSlot(s, pptx, { x: x04 + i * (w4 + gap4), y: 2.1, w: w4, h: 2.8, label }));
    if (d.ghiChu) s.addText(d.ghiChu, { x: PAGE.margin, y: 5.35, w: CONTENT_W, h: 0.45,
      fontFace: F.body, fontSize: SIZE.caption, color: C.grey, align: 'center' });
    B.footer(s, n);
    ghi(d.tieuDe, 12, d.tieuDe, d.speak);
  },

  /** Mẫu câu mục tiêu — khối Navy trái, ảnh phải */
  target(s, d) {
    B.bgIvory(s); B.goldBar(s, pptx);
    B.stageTag(s, d.stage);
    khoiMauCau(s, { x: PAGE.margin + 0.3, y: 2.35, w: 6.0, h: 1.9,
      truoc: d.cau, gold: d.gold, sau: d.sau });
    B.imageSlot(s, pptx, { x: 7.1, y: 1.4, w: 5.5, h: 4.3, label: d.anh });
    B.footer(s, n);
    ghi(`Mẫu câu: ${d.cau}${d.gold || ''}`, 20, d.cau + (d.gold || '') + (d.sau || ''), d.speak);
  },

  /** TPR — một động từ lớn, nền Navy */
  tpr(s, d) {
    B.bgNavy(s);
    s.addText(d.tu, { x: 0, y: 2.6, w: PAGE.w, h: 1.6,
      fontFace: F.title, fontSize: 96, bold: true, color: C.gold, align: 'center' });
    s.addText(d.phu, { x: 0, y: 4.4, w: PAGE.w, h: 0.6,
      fontFace: F.body, fontSize: SIZE.body, color: C.white, align: 'center' });
    ghi(`TPR ${d.tu}`, 12, `${d.tu} ${d.phu}`, d.speak);
  },

  /** Trò chơi — tiêu đề + mẫu câu canh giữa + emoji */
  game(s, d) {
    B.bgIvory(s); B.goldBar(s, pptx);
    B.stageTag(s, d.stage);
    tieuDeGiua(s, d.tieuDe, 1.15);
    khoiMauCau(s, { x: 3.4, y: 2.55, w: 6.5, h: 1.5,
      truoc: d.cau, gold: d.gold, sau: d.sau, canGiua: true });
    s.addText(d.emoji, { x: PAGE.margin, y: 4.35, w: CONTENT_W, h: 1.0, fontSize: 64, align: 'center' });
    B.footer(s, n);
    ghi(d.tieuDe, 12, d.tieuDe, d.speak);
  },

  taskInstruction(s, d) {
    B.bgWhite(s); B.goldBar(s, pptx);
    s.addShape(pptx.ShapeType.roundRect, { x: PAGE.margin + 0.3, y: 2.3, w: 3.0, h: 1.1,
      rectRadius: 0.12, fill: { color: C.navy } });
    s.addText('YOUR TASK', { x: PAGE.margin + 0.3, y: 2.3, w: 3.0, h: 1.1,
      fontFace: F.body, fontSize: SIZE.body, bold: true, color: C.gold,
      align: 'center', valign: 'middle', charSpacing: 2 });
    d.buoc.forEach((t, i) => {
      const y = 1.55 + i * 1.15;
      s.addText(`${i + 1}`, { x: 4.5, y, w: 0.6, h: 0.8,
        fontFace: F.title, fontSize: 36, bold: true, color: C.navy, align: 'center' });
      s.addText(t, { x: 5.2, y, w: 6.5, h: 0.8,
        fontFace: F.body, fontSize: SIZE.body, color: C.ink, valign: 'middle' });
    });
    s.addText(`⏱ ${d.phut} phút`, { x: PAGE.w - 2.8, y: 5.35, w: 2.2, h: 0.5,
      fontFace: F.body, fontSize: SIZE.body, bold: true, color: C.burgundy, align: 'right' });
    B.footer(s, n);
    ghi('Task instruction', 25, 'YOUR TASK ' + d.buoc.join(' '), d.speak);
  },

  /** Slide để trên màn hình lúc bé nói — gần như không chữ */
  taskPrompt(s, d) {
    B.bgIvory(s);
    s.addText(d.tieuDe, { x: 0, y: 0.85, w: PAGE.w, h: 0.85,
      fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy, align: 'center' });
    const n3 = d.o.length, w3 = n3 <= 2 ? 4.4 : n3 === 3 ? 3.2 : 2.6, gap3 = 0.4;
    const x03 = (PAGE.w - (n3 * w3 + (n3 - 1) * gap3)) / 2;
    d.o.forEach((label, i) =>
      B.imageSlot(s, pptx, { x: x03 + i * (w3 + gap3), y: 2.15, w: w3, h: 3.6, label }));
    ghi(d.tieuDe, 12, d.tieuDe, d.speak);
  },

  useful(s, d) {
    B.bgWhite(s); B.goldBar(s, pptx);
    tieuDeGiua(s, d.tieuDe);
    s.addShape(pptx.ShapeType.roundRect, { x: 2.6, y: 2.2, w: 8.1, h: 3.2, rectRadius: 0.18,
      fill: { color: C.ivory }, line: { color: C.gold, width: 2 } });
    d.cum.forEach((t, i) => s.addText(t, { x: 3.0, y: 2.55 + i * 0.95, w: 7.3, h: 0.7,
      fontFace: F.body, fontSize: 32, bold: true, color: C.navy, align: 'center' }));
    B.footer(s, n);
    ghi('Useful language', 12, d.tieuDe + ' ' + d.cum.join(' '), d.speak);
  },

  feedback(s, d) {
    B.bgWhite(s); B.goldBar(s, pptx);
    tieuDeGiua(s, d.tieuDe, 0.95);
    s.addShape(pptx.ShapeType.roundRect, { x: PAGE.margin + 0.6, y: 2.05, w: CONTENT_W - 1.2, h: 3.4,
      rectRadius: 0.14, fill: { color: C.ivory }, line: { color: C.navy, width: 2 } });
    s.addText(d.goiY, { x: PAGE.margin + 0.9, y: 3.45, w: CONTENT_W - 1.8, h: 0.6,
      fontFace: F.body, fontSize: SIZE.kidsMin, color: C.grey, align: 'center' });
    B.footer(s, n);
    ghi('Feedback', 12, d.tieuDe, d.speak);
  },

  homework(s, d) {
    B.bgWhite(s); B.goldBar(s, pptx);
    s.addShape(pptx.ShapeType.roundRect, { x: PAGE.margin + 0.3, y: 2.6, w: 3.0, h: 1.1,
      rectRadius: 0.12, fill: { color: C.burgundy } });
    s.addText('HOMEWORK', { x: PAGE.margin + 0.3, y: 2.6, w: 3.0, h: 1.1,
      fontFace: F.body, fontSize: SIZE.body, bold: true, color: C.white,
      align: 'center', valign: 'middle', charSpacing: 1 });
    d.viec.forEach(([t, meta], i) => {
      const y = 1.5 + i * 1.35;
      s.addText(t, { x: 4.5, y, w: 7.8, h: 0.55,
        fontFace: F.body, fontSize: SIZE.kidsMin, bold: true, color: C.ink });
      s.addText(meta, { x: 4.5, y: y + 0.55, w: 7.8, h: 0.4,
        fontFace: F.body, fontSize: SIZE.caption, color: C.grey });
    });
    B.footer(s, n);
    ghi('Homework', 40, d.viec.map(v => v[0]).join(' '), d.speak);
  },

  closing(s) {
    B.bgNavy(s);
    s.addText('Ms.Ngọc Elite English', { x: 0, y: 2.75, w: PAGE.w, h: 0.9,
      fontFace: F.title, fontSize: 44, bold: true, color: C.white, align: 'center' });
    s.addShape(pptx.ShapeType.rect, { x: PAGE.w / 2 - 1.1, y: 3.85, w: 2.2, h: 0.05, fill: { color: C.gold } });
    s.addText('Thấu hiểu để dẫn lối.', { x: 0, y: 4.15, w: PAGE.w, h: 0.6,
      fontFace: F.body, fontSize: SIZE.kidsMin, color: C.gold, align: 'center', italic: true });
    ghi('Closing', null, '', 'Miễn — slide đóng');
  },
};

/* ───────────────────────── Dựng ───────────────────────── */
for (const d of bai.slides) {
  const ve = KIEU[d.kieu];
  if (!ve) { console.error(`✗ Không biết kiểu slide "${d.kieu}"`); process.exit(1); }
  n++;
  ve(pptx.addSlide(), d);
}

const out = path.join(__dirname, '..', 'slides', bai.meta.tenFile + '.pptx');
pptx.writeFile({ fileName: out }).then(() => {
  console.log(`\n✅ Đã xuất: ${out}`);
  console.log(`   ${bai.meta.tieuDe}`);
  console.log(`   ${audit.length} slide · font ${F.title} / ${F.body}${B.FALLBACK ? ' (fallback)' : ''}\n`);

  console.log('── Ngân sách chữ (Luật 2 · deck-elite) ──');
  let hong = 0;
  audit.forEach(a => {
    if (a.budget === null) return console.log(`  ${String(a.no).padStart(2)}. ${a.ten} — miễn`);
    const ok = a.tu <= a.budget; if (!ok) hong++;
    console.log(`  ${ok ? '✓' : '✗'} ${String(a.no).padStart(2)}. ${a.ten} — ${a.tu}/${a.budget} từ`);
  });
  console.log(hong === 0 ? '\n✅ Không slide nào vượt ngân sách chữ.'
    : `\n❌ ${hong} slide vượt — phải TÁCH slide, không thu nhỏ chữ.`);

  console.log('\n── Luật 1: slide này khiến bé nói bằng cách nào? ──');
  audit.forEach(a => console.log(`  ${String(a.no).padStart(2)}. ${a.ten}\n      → ${a.speak}`));
  console.log('\nBước tiếp: npm run audit  (soi file .pptx vừa dựng)\n');
  if (hong) process.exitCode = 1;
}).catch(e => { console.error('LỖI:', e); process.exitCode = 1; });
