'use strict';
/**
 * Deck: Kid's Box Starter · Unit 1 "Hello!" · Buổi 1 — lớp Kids 5–6 tuổi
 * Dựng 1-1 từ timeline mục 7 của lesson-plans/KIDS_KB-Starter_U01_B01.md
 *
 * Tuân thủ `deck-elite`:
 *  - Luật 1: mỗi slide trả lời được "slide này khiến học viên nói bằng cách nào?" (ghi ở field .speak)
 *  - Luật 2: ngân sách chữ — kiểm tra tự động ở cuối file
 *  - Luật 3: sàn cỡ chữ 24pt cho deck Kids
 *  - Gold KHÔNG bao giờ làm chữ trên nền sáng (2.42:1 — trượt WCAG).
 *    Khi cần nhấn bằng Gold, đặt câu trong khối Navy rồi mới tô Gold (5.99:1 — đạt AA).
 *  - Burgundy tối đa 1 lần/slide.
 */

const path = require('path');
const PptxGenJS = require('pptxgenjs');
const B = require('./brand.js');
const { C, F, PAGE, CONTENT_W, SIZE } = B;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'KIDS169', width: PAGE.w, height: PAGE.h });
pptx.layout = 'KIDS169';
pptx.author = 'Ms.Ngọc Elite English';
pptx.company = 'Ms.Ngọc Elite English';
pptx.title = "Kid's Box Starter · Unit 1 Hello! · Buổi 1";

/** Thu thập để kiểm tra ngân sách chữ sau khi dựng xong */
const audit = [];
function track(no, name, budget, visibleText, speak) {
  audit.push({ no, name, budget, words: B.countWords(visibleText), speak });
}

let n = 0;
const next = () => ++n;

/* ─────────────────────────── 1. P01 Cover ─────────────────────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgNavy(s);
  s.addShape(pptx.ShapeType.rect, { x: PAGE.margin, y: 3.30, w: 2.2, h: 0.06, fill: { color: C.gold } });
  s.addText('Hello!', {
    x: PAGE.margin, y: 2.05, w: CONTENT_W, h: 1.2,
    fontFace: F.title, fontSize: 60, bold: true, color: C.white,
  });
  s.addText("Kid's Box Starter  ·  Unit 1  ·  Buổi 1", {
    x: PAGE.margin, y: 3.55, w: CONTENT_W, h: 0.45,
    fontFace: F.body, fontSize: SIZE.labelSm, color: C.gold, charSpacing: 1,
  });
  s.addText('Lớp Kids 5–6 tuổi  ·  45 phút  ·  Ms.Ngọc Elite English', {
    x: PAGE.margin, y: 4.02, w: CONTENT_W, h: 0.4,
    fontFace: F.body, fontSize: SIZE.caption, color: C.white,
  });
  track(no, 'P01 Cover', null, '', 'Miễn — slide bìa');
}

/* ───────────────────── 2. P02 Today I can… ───────────────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgIvory(s); B.goldBar(s, pptx);
  s.addText('Today I can…', {
    x: PAGE.margin, y: 1.15, w: CONTENT_W, h: 0.9,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy, align: 'center',
  });
  const items = ['say hello', 'say my name'];
  items.forEach((t, i) => {
    const y = 2.65 + i * 1.15;
    // ô tick trống — bé tự tick cuối buổi
    s.addShape(pptx.ShapeType.roundRect, {
      x: 3.55, y, w: 0.62, h: 0.62, rectRadius: 0.08,
      fill: { color: C.white }, line: { color: C.navy, width: 3 },
    });
    s.addText(t, {
      x: 4.45, y, w: 6.2, h: 0.62,
      fontFace: F.body, fontSize: SIZE.target, bold: true, color: C.navy, valign: 'middle',
    });
  });
  B.footer(s, no);
  track(no, 'P02 Today I can', 20, 'Today I can say hello say my name',
    'Cô hỏi "Can you do this?" — bé trả lời đầu buổi và cuối buổi');
}

/* ──────────────── 3. Stage 1 — Hello Song (Engage) ──────────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgIvory(s); B.goldBar(s, pptx);
  B.stageTag(s, 'Stage 1 · Hello song · 4 phút');
  s.addText('Sing with me!', {
    x: PAGE.margin + 0.3, y: 1.25, w: 5.6, h: 1.0,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy,
  });
  s.addText('🎵', { x: PAGE.margin + 0.3, y: 2.45, w: 5.6, h: 1.4, fontSize: 90 });
  s.addText('[AUDIO: Unit 1 — track số __]', {
    x: PAGE.margin + 0.3, y: 4.1, w: 5.6, h: 0.5,
    fontFace: F.body, fontSize: SIZE.caption, color: C.grey,
  });
  B.imageSlot(s, pptx, { x: 7.0, y: 1.25, w: 5.6, h: 4.4, label: 'nhân vật Unit 1 đang vẫy tay' });
  B.footer(s, no);
  track(no, 'Hello song', 12, 'Sing with me!', 'Bé hát và làm động tác — hát không bị coi là bị hỏi bài');
}

/* ──────────── 4. Stage 2 — Puppet hello (Engage) ──────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgIvory(s); B.goldBar(s, pptx);
  B.stageTag(s, 'Stage 2 · Puppet hello · 4 phút');
  s.addText('Say hello to Teddy', {
    x: PAGE.margin + 0.3, y: 1.35, w: 5.6, h: 1.6,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy,
  });
  s.addText('Teddy is shy. Help him!', {
    x: PAGE.margin + 0.3, y: 3.1, w: 5.6, h: 0.7,
    fontFace: F.body, fontSize: SIZE.kidsMin, color: C.ink,
  });
  B.imageSlot(s, pptx, { x: 7.0, y: 1.25, w: 5.6, h: 4.4, label: 'con rối / thú bông của cô' });
  B.footer(s, no);
  track(no, 'Puppet hello', 12, 'Say hello to Teddy Teddy is shy Help him!',
    'Bé nói với con rối — dễ hơn nói với người lạ, gỡ rào cản buổi đầu');
}

/* ─────────── 5. Stage 3 — Listen and point (Study) ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgWhite(s); B.goldBar(s, pptx);
  B.stageTag(s, 'Stage 3 · Listen and point · 6 phút');
  s.addText('Listen and point', {
    x: PAGE.margin, y: 1.0, w: CONTENT_W, h: 0.8,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy, align: 'center',
  });
  const slots = ['nhân vật 1', 'nhân vật 2', 'nhân vật 3', 'nhân vật 4'];
  slots.forEach((label, i) => {
    B.imageSlot(s, pptx, { x: 1.15 + i * 2.85, y: 2.1, w: 2.5, h: 2.8, label });
  });
  s.addText('[AUDIO: Listen and point — track số __]', {
    x: PAGE.margin, y: 5.35, w: CONTENT_W, h: 0.45,
    fontFace: F.body, fontSize: SIZE.caption, color: C.grey, align: 'center',
  });
  B.footer(s, no);
  track(no, 'Listen and point', 12, 'Listen and point',
    'Bé chỉ vào hình rồi nhắc lại tên — nối âm với hình trước khi phải tự nói');
}

/* ─────────── 6–7. P04 Target language (×2) ─────────── */
function targetSlide({ stage, sentence, goldPart, imgLabel, speak }) {
  const no = next();
  const s = pptx.addSlide();
  B.bgIvory(s); B.goldBar(s, pptx);
  B.stageTag(s, stage);
  // Khối Navy: nền tối để được phép dùng Gold làm chữ nhấn (5.99:1 — đạt AA)
  s.addShape(pptx.ShapeType.roundRect, {
    x: PAGE.margin + 0.3, y: 2.35, w: 6.0, h: 1.9, rectRadius: 0.16,
    fill: { color: C.navy },
  });
  const runs = goldPart
    ? [
        { text: sentence, options: { color: C.white } },
        { text: goldPart, options: { color: C.gold, bold: true } },
      ]
    : [{ text: sentence, options: { color: C.white } }];
  s.addText(runs, {
    x: PAGE.margin + 0.55, y: 2.35, w: 5.5, h: 1.9,
    fontFace: F.body, fontSize: SIZE.target, bold: true, valign: 'middle',
  });
  B.imageSlot(s, pptx, { x: 7.1, y: 1.4, w: 5.5, h: 4.3, label: imgLabel });
  B.footer(s, no);
  track(no, `P04 ${sentence}${goldPart || ''}`, 20, sentence + (goldPart || ''), speak);
}

targetSlide({
  stage: 'Stage 3 · Mẫu câu 1',
  sentence: 'Hello!',
  goldPart: null,
  imgLabel: 'bé vẫy tay chào',
  speak: 'Bé đọc to mẫu và vẫy tay — gắn câu với cử chỉ',
});

targetSlide({
  stage: 'Stage 3 · Mẫu câu 2',
  sentence: "I'm ",
  goldPart: '________',
  imgLabel: 'nhân vật tự giới thiệu',
  speak: 'Bé thay phần Gold bằng tên của chính mình — câu đầu tiên bé sở hữu',
});

/* ─────────── 8. P-TPR (biến thể Kids) ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgNavy(s);
  s.addText('WAVE!', {
    x: 0, y: 2.6, w: PAGE.w, h: 1.6,
    fontFace: F.title, fontSize: 96, bold: true, color: C.gold, align: 'center',
  });
  s.addText('Stand up  ·  Wave  ·  Say hello', {
    x: 0, y: 4.4, w: PAGE.w, h: 0.6,
    fontFace: F.body, fontSize: SIZE.body, color: C.white, align: 'center',
  });
  track(no, 'P-TPR Wave', 12, 'WAVE! Stand up Wave Say hello',
    'Cả lớp đứng dậy làm động tác và nói to — vận động lần 1');
}

/* ─────────── 9. Stage 5 — Name circle game ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgIvory(s); B.goldBar(s, pptx);
  B.stageTag(s, 'Stage 5 · Name circle · 6 phút');
  s.addText('Catch the ball!', {
    x: PAGE.margin, y: 1.15, w: CONTENT_W, h: 0.9,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy, align: 'center',
  });
  s.addShape(pptx.ShapeType.roundRect, {
    x: 3.4, y: 2.55, w: 6.5, h: 1.5, rectRadius: 0.16, fill: { color: C.navy },
  });
  s.addText([
    { text: "Hello! I'm ", options: { color: C.white } },
    { text: '______', options: { color: C.gold, bold: true } },
  ], {
    x: 3.6, y: 2.55, w: 6.1, h: 1.5,
    fontFace: F.body, fontSize: SIZE.target, bold: true, align: 'center', valign: 'middle',
  });
  s.addText('⚽', { x: PAGE.margin, y: 4.35, w: CONTENT_W, h: 1.0, fontSize: 64, align: 'center' });
  B.footer(s, no);
  track(no, 'Name circle game', 12, 'Catch the ball!',
    'Bắt bóng là phải nói tên — lần đầu bé tự sản sinh mẫu câu mục tiêu');
}

/* ─────────── 10. Stage 6 — Point and say ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgWhite(s); B.goldBar(s, pptx);
  B.stageTag(s, 'Stage 6 · Point and say · 5 phút');
  s.addText('What is it?', {
    x: PAGE.margin, y: 1.0, w: CONTENT_W, h: 0.8,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy, align: 'center',
  });
  ['từ 1', 'từ 2', 'từ 3', 'từ 4'].forEach((label, i) => {
    B.imageSlot(s, pptx, { x: 1.15 + i * 2.85, y: 2.1, w: 2.5, h: 2.8, label });
  });
  s.addText('Cô chỉ nhanh dần — biến thành trò chơi tốc độ', {
    x: PAGE.margin, y: 5.35, w: CONTENT_W, h: 0.45,
    fontFace: F.body, fontSize: SIZE.caption, color: C.grey, align: 'center',
  });
  B.footer(s, no);
  track(no, 'Point and say', 12, 'What is it?',
    'Bé gọi tên khi cô chỉ — tăng tốc dần để tạo phản xạ, đo outcome 2');
}

/* ─────────── 11. Stage 7 — Hide and guess ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgIvory(s); B.goldBar(s, pptx);
  B.stageTag(s, 'Stage 7 · Hide and guess · 5 phút');
  s.addText('Guess!', {
    x: PAGE.margin, y: 1.15, w: CONTENT_W, h: 0.9,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy, align: 'center',
  });
  s.addShape(pptx.ShapeType.roundRect, {
    x: 3.9, y: 2.6, w: 5.5, h: 1.5, rectRadius: 0.16, fill: { color: C.navy },
  });
  s.addText([
    { text: 'Is it ', options: { color: C.white } },
    { text: '______', options: { color: C.gold, bold: true } },
    { text: '?', options: { color: C.white } },
  ], {
    x: 4.1, y: 2.6, w: 5.1, h: 1.5,
    fontFace: F.body, fontSize: SIZE.target, bold: true, align: 'center', valign: 'middle',
  });
  s.addText('🙈', { x: PAGE.margin, y: 4.4, w: CONTENT_W, h: 1.0, fontSize: 64, align: 'center' });
  B.footer(s, no);
  track(no, 'Hide and guess', 12, 'Guess! Is it ______?',
    'Bé phải ĐẶT câu hỏi để đoán — không chỉ trả lời thụ động');
}

/* ─────────── 12. P09 Task instruction ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgWhite(s); B.goldBar(s, pptx);
  s.addShape(pptx.ShapeType.roundRect, {
    x: PAGE.margin + 0.3, y: 2.3, w: 3.0, h: 1.1, rectRadius: 0.12, fill: { color: C.navy },
  });
  s.addText('YOUR TASK', {
    x: PAGE.margin + 0.3, y: 2.3, w: 3.0, h: 1.1,
    fontFace: F.body, fontSize: SIZE.body, bold: true, color: C.gold,
    align: 'center', valign: 'middle', charSpacing: 2,
  });
  const steps = ['Look at the friend.', 'Say hello.', 'Say your name.'];
  steps.forEach((t, i) => {
    const y = 1.55 + i * 1.15;
    s.addText(`${i + 1}`, {
      x: 4.5, y, w: 0.6, h: 0.8,
      fontFace: F.title, fontSize: 36, bold: true, color: C.navy, align: 'center',
    });
    s.addText(t, {
      x: 5.2, y, w: 6.5, h: 0.8,
      fontFace: F.body, fontSize: SIZE.body, color: C.ink, valign: 'middle',
    });
  });
  s.addText('⏱ 5 phút', {
    x: PAGE.w - 2.8, y: 5.35, w: 2.2, h: 0.5,
    fontFace: F.body, fontSize: SIZE.body, bold: true, color: C.burgundy, align: 'right',
  });
  B.footer(s, no);
  track(no, 'P09 Task instruction', 25, 'YOUR TASK Look at the friend. Say hello. Say your name.',
    'Rõ nhiệm vụ thì bé không mất thời gian hỏi lại — dành trọn 5 phút để nói');
}

/* ─────────── 13. P10 Task prompt ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgIvory(s);
  s.addText('Meet my three friends', {
    x: 0, y: 0.85, w: PAGE.w, h: 0.85,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy, align: 'center',
  });
  ['bạn 1', 'bạn 2', 'bạn 3'].forEach((label, i) => {
    B.imageSlot(s, pptx, { x: 1.35 + i * 3.7, y: 2.15, w: 3.2, h: 3.6, label });
  });
  track(no, 'P10 Task prompt', 12, 'Meet my three friends',
    'Gần như không chữ — không có gì để đọc, chỉ còn cách nói');
}

/* ─────────── 14. P11 Useful language (bản Kids) ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgWhite(s); B.goldBar(s, pptx);
  s.addText('If you forget…', {
    x: PAGE.margin, y: 1.0, w: CONTENT_W, h: 0.8,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy, align: 'center',
  });
  s.addShape(pptx.ShapeType.roundRect, {
    x: 2.6, y: 2.2, w: 8.1, h: 3.2, rectRadius: 0.18,
    fill: { color: C.ivory }, line: { color: C.gold, width: 2 },
  });
  ['Hello!', "I'm ______.", 'Again, please.'].forEach((t, i) => {
    s.addText(t, {
      x: 3.0, y: 2.55 + i * 0.95, w: 7.3, h: 0.7,
      fontFace: F.body, fontSize: 32, bold: true, color: C.navy, align: 'center',
    });
  });
  B.footer(s, no);
  track(no, 'P11 Useful language', 12, "If you forget… Hello! I'm ______. Again, please.",
    'Gỡ bí khi bé đứng hình — đặc biệt quan trọng với bé rụt rè buổi đầu');
}

/* ─────────── 15. P12 Feedback board ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgWhite(s); B.goldBar(s, pptx);
  s.addText('Say it again, better', {
    x: PAGE.margin, y: 0.95, w: CONTENT_W, h: 0.8,
    fontFace: F.title, fontSize: SIZE.h1, bold: true, color: C.navy, align: 'center',
  });
  s.addShape(pptx.ShapeType.roundRect, {
    x: PAGE.margin + 0.6, y: 2.05, w: CONTENT_W - 1.2, h: 3.4, rectRadius: 0.14,
    fill: { color: C.ivory }, line: { color: C.navy, width: 2 },
  });
  s.addText('[Cô gõ trực tiếp câu cần sửa vào đây — KHÔNG ghi tên bé]', {
    x: PAGE.margin + 0.9, y: 3.45, w: CONTENT_W - 1.8, h: 0.6,
    fontFace: F.body, fontSize: SIZE.kidsMin, color: C.grey, align: 'center',
  });
  B.footer(s, no);
  track(no, 'P12 Feedback', 12, 'Say it again, better',
    'Cả lớp cùng đọc lại câu đúng — delayed correction, không ngắt lời bé');
}

/* ─────────── 16. P13 Homework ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgWhite(s); B.goldBar(s, pptx);
  s.addShape(pptx.ShapeType.roundRect, {
    x: PAGE.margin + 0.3, y: 2.6, w: 3.0, h: 1.1, rectRadius: 0.12, fill: { color: C.burgundy },
  });
  s.addText('HOMEWORK', {
    x: PAGE.margin + 0.3, y: 2.6, w: 3.0, h: 1.1,
    fontFace: F.body, fontSize: SIZE.body, bold: true, color: C.white,
    align: 'center', valign: 'middle', charSpacing: 1,
  });
  const hw = [
    ['Hát lại bài Unit 1', '2 lần  ·  5 phút'],
    ['Quay video 15 giây: chào 3 người trong nhà', 'Gửi Zalo lớp  ·  5 phút'],
    ['Tô màu flashcard bé thích', 'Mang khoe buổi sau  ·  5 phút'],
  ];
  hw.forEach(([t, meta], i) => {
    const y = 1.5 + i * 1.35;
    s.addText(t, {
      x: 4.5, y, w: 7.8, h: 0.55,
      fontFace: F.body, fontSize: SIZE.kidsMin, bold: true, color: C.ink,
    });
    s.addText(meta, {
      x: 4.5, y: y + 0.55, w: 7.8, h: 0.4,
      fontFace: F.body, fontSize: SIZE.caption, color: C.grey,
    });
  });
  B.footer(s, no);
  track(no, 'P13 Homework', 40, hw.map(h => h[0]).join(' '),
    'Cô hỏi ICQ về bài tập, bé nhắc lại yêu cầu bằng lời');
}

/* ─────────── 17. P14 Closing ─────────── */
{
  const no = next();
  const s = pptx.addSlide();
  B.bgNavy(s);
  s.addText('Ms.Ngọc Elite English', {
    x: 0, y: 2.75, w: PAGE.w, h: 0.9,
    fontFace: F.title, fontSize: 44, bold: true, color: C.white, align: 'center',
  });
  s.addShape(pptx.ShapeType.rect, { x: PAGE.w / 2 - 1.1, y: 3.85, w: 2.2, h: 0.05, fill: { color: C.gold } });
  s.addText('Thấu hiểu để dẫn lối.', {
    x: 0, y: 4.15, w: PAGE.w, h: 0.6,
    fontFace: F.body, fontSize: SIZE.kidsMin, color: C.gold, align: 'center', italic: true,
  });
  track(no, 'P14 Closing', null, '', 'Miễn — slide đóng');
}

/* ──────────────── Kiểm tra ngân sách chữ & xuất file ──────────────── */
const out = path.join(__dirname, '..', 'slides', 'KIDS_KB-Starter_U01_B01.pptx');

pptx.writeFile({ fileName: out }).then(() => {
  console.log(`\n✅ Đã xuất: ${out}`);
  console.log(`   Tổng ${audit.length} slide · font: ${F.title} / ${F.body}${B.FALLBACK ? ' (fallback)' : ''}\n`);

  console.log('── Kiểm tra ngân sách chữ (Luật 2 · deck-elite) ──');
  let fail = 0;
  audit.forEach(a => {
    if (a.budget === null) { console.log(`  ${String(a.no).padStart(2)}. ${a.name} — miễn`); return; }
    const ok = a.words <= a.budget;
    if (!ok) fail++;
    console.log(`  ${ok ? '✓' : '✗'} ${String(a.no).padStart(2)}. ${a.name} — ${a.words}/${a.budget} từ`);
  });
  console.log(fail === 0
    ? '\n✅ Không slide nào vượt ngân sách chữ.\n'
    : `\n❌ ${fail} slide vượt ngân sách — phải tách slide, KHÔNG thu nhỏ chữ.\n`);

  console.log('── Luật 1: slide này khiến học viên nói bằng cách nào? ──');
  audit.forEach(a => console.log(`  ${String(a.no).padStart(2)}. ${a.name}\n      → ${a.speak}`));
  if (fail > 0) process.exitCode = 1;
}).catch(err => { console.error('LỖI:', err); process.exitCode = 1; });
