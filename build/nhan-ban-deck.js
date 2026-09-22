'use strict';
/**
 * NHÂN BẢN rồi sửa một deck PowerPoint có sẵn — KHÔNG BAO GIỜ ĐỘNG VÀO FILE GỐC.
 *
 * Chạy:
 *   node nhan-ban-deck.js "D:\KHO-MSNGOC\...\KIDS BOX 1 UNIT 1.pptx"
 *   node nhan-ban-deck.js "<file gốc>" "<thư mục ra>"
 *
 * Làm ba việc:
 *   1. Mở file gốc ở chế độ CHỈ ĐỌC, chép sang thư mục làm việc riêng.
 *   2. Soi bản sao theo luật của cô và theo lứa tuổi — xuất phiếu chấm markdown.
 *   3. Sửa TRÊN BẢN SAO: đóng dấu chân trang Ms.Ngọc Elite English lên mọi slide.
 *
 * Ba lớp chặn để file gốc không bao giờ bị ghi đè — xem hàm chanGhiDeGoc().
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const B = require('./brand.js');

const EMU = 914400;
const GOLD = 'C9A227', BURGUNDY = '7B2233', NAVY = '0F2A4A', GREY = '6B7280';
const CHAN_TRANG = 'Ms.Ngọc Elite English  ·  Thấu hiểu để dẫn lối.';

const src = process.argv[2];
const outDir = path.resolve(process.argv[3] || path.join(__dirname, '..', 'slides', 'ban-sao'));

if (!src) {
  console.error('\nDùng: node nhan-ban-deck.js "<đường dẫn file .pptx gốc>" ["<thư mục ra>"]\n');
  process.exit(1);
}
const srcAbs = path.resolve(src);
if (!fs.existsSync(srcAbs)) { console.error(`\n✗ Không thấy file: ${srcAbs}\n`); process.exit(1); }
if (path.extname(srcAbs).toLowerCase() !== '.pptx') {
  console.error('\n✗ Chỉ nhận file .pptx. File .ppt cũ thì mở bằng PowerPoint rồi Save As .pptx trước.\n');
  process.exit(1);
}

/** Ba lớp chặn: bản sao không được trùng file gốc, không được nằm trong thư mục gốc */
function chanGhiDeGoc(outFile) {
  const thuMucGoc = path.dirname(srcAbs);
  if (path.resolve(outFile) === srcAbs) throw new Error('CHẶN: bản sao trùng đúng file gốc.');
  if (path.resolve(outDir) === path.resolve(thuMucGoc))
    throw new Error(`CHẶN: thư mục ra trùng thư mục chứa file gốc (${thuMucGoc}). Chọn thư mục khác.`);
  if (fs.existsSync(outFile) && fs.realpathSync(outFile) === fs.realpathSync(srcAbs))
    throw new Error('CHẶN: bản sao là liên kết trỏ về file gốc.');
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

(async () => {
  // ── 1. Đọc file gốc, CHỈ ĐỌC ──
  const goc = fs.readFileSync(srcAbs);                 // đọc vào bộ nhớ, không mở handle ghi
  const kt = (goc.length / 1048576).toFixed(1);
  console.log(`\nFile gốc : ${srcAbs}`);
  console.log(`           ${kt} MB — mở ở chế độ CHỈ ĐỌC, sẽ không bị sửa\n`);

  fs.mkdirSync(outDir, { recursive: true });
  const ten = path.basename(srcAbs, '.pptx').replace(/[^\w\-. ]+/g, '_');
  const outFile = path.join(outDir, `${ten}__MNEE.pptx`);
  chanGhiDeGoc(outFile);

  const zip = await JSZip.loadAsync(goc);

  // ── Khổ slide ──
  let W = 12192000, H = 6858000;
  const pres = zip.file('ppt/presentation.xml');
  if (pres) {
    const x = await pres.async('string');
    const m = x.match(/<p:sldSz[^>]*cx="(\d+)"[^>]*cy="(\d+)"/);
    if (m) { W = +m[1]; H = +m[2]; }
  }
  console.log(`Khổ slide: ${(W / EMU).toFixed(2)} × ${(H / EMU).toFixed(2)} inch`);

  // ── 2. Soi từng slide ──
  const ten2 = Object.keys(zip.files)
    .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => (+a.match(/(\d+)/)[1]) - (+b.match(/(\d+)/)[1]));
  console.log(`Số slide : ${ten2.length}\n`);

  const loi = [];      // lỗi theo luật của cô
  const canXem = [];   // chỗ cần mắt người quyết
  const bang = [];
  let daDong = 0, boQua = 0;

  for (const nm of ten2) {
    const no = +nm.match(/(\d+)/)[1];
    let xml = await zip.file(nm).async('string');

    const runs = [...xml.matchAll(/<a:rPr[^>]*?\bsz="(\d+)"[^>]*?>(.*?)<\/a:rPr>\s*<a:t>(.*?)<\/a:t>/gs)]
      // Tên trường phải khớp brand.laChuChoCo(): {pt, color, text}
      .map(m => ({
        pt: +m[1] / 100,
        color: (m[2].match(/<a:srgbClr val="([0-9A-Fa-f]{6})"/) || [])[1]?.toUpperCase() || null,
        text: m[3].replace(/&amp;/g, '&').replace(/&lt;/g, '<'),
      }));
    // Chỉ tính chữ BÉ đọc; chữ cho cô (nhãn stage, chân trang, ô chờ) không tính
    const runsBe = runs.filter(r => !B.laChuChoCo(r));
    const soTu = runsBe.reduce((n, r) => n + B.countWords(r.text), 0);
    const anh = (xml.match(/<p:pic>/g) || []).length;
    const oCho = (xml.match(/\[ẢNH:/g) || []).length;
    const nhoNhat = runsBe.length ? Math.min(...runsBe.map(r => r.pt)) : null;

    // Luật của cô — sai là phải sửa
    runs.filter(r => r.pt < 16).forEach(r =>
      loi.push(`slide ${no}: chữ ${r.pt}pt < sàn 16pt — "${r.text.slice(0, 40)}"`));
    const soBurgundy = (xml.match(new RegExp(`val="${BURGUNDY}"`, 'g')) || []).length;
    if (soBurgundy > 1) loi.push(`slide ${no}: Burgundy ${soBurgundy} lần (tối đa 1)`);

    // Cần mắt người — lứa tuổi
    if (soTu > 25) canXem.push(`slide ${no}: **${soTu} từ** — quá nhiều với bé 5.5 tuổi (ngân sách 12–25)`);
    if (nhoNhat !== null && nhoNhat < 24)
      canXem.push(`slide ${no}: chữ nhỏ nhất **${nhoNhat}pt** — bé đọc phải ≥ 24pt`);
    if (anh === 0 && oCho === 0 && soTu > 0)
      canXem.push(`slide ${no}: **không có ảnh nào** — bé 5.5 tuổi chưa đọc được chữ`);
    else if (anh === 0 && oCho > 0)
      canXem.push(`slide ${no}: có ${oCho} ô chờ ảnh **chưa thả hình vào**`);
    runs.filter(r => r.color === GOLD).forEach(r =>
      canXem.push(`slide ${no}: có chữ màu Gold — kiểm xem có nằm trên nền sáng không (2.42:1, trượt WCAG)`));

    bang.push({ no, soTu, anh: anh || oCho, nhoNhat, soRun: runsBe.length });

    // ── 3. Sửa TRÊN BẢN SAO: đóng chân trang ──
    const cx = Math.round(W * 0.6), cy = Math.round(0.32 * EMU);
    const ox = Math.round((W - cx) / 2), oy = Math.round(H - 0.52 * EMU);
    const sp = `<p:sp><p:nvSpPr><p:cNvPr id="9${String(no).padStart(3, '0')}" name="MNEE Footer"/>`
      + `<p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>`
      + `<p:spPr><a:xfrm><a:off x="${ox}" y="${oy}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>`
      + `<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>`
      + `<p:txBody><a:bodyPr wrap="square" rtlCol="0"><a:spAutoFit/></a:bodyPr><a:lstStyle/>`
      + `<a:p><a:pPr algn="ctr"/><a:r>`
      + `<a:rPr lang="vi-VN" sz="1100" b="0" dirty="0"><a:solidFill><a:srgbClr val="${GREY}"/></a:solidFill>`
      + `<a:latin typeface="Calibri"/></a:rPr><a:t>${esc(CHAN_TRANG)}</a:t></a:r></a:p></p:txBody></p:sp>`;

    // Chỉ đóng dấu khi slide CHƯA có dấu của trung tâm — tránh hai chân trang chồng nhau
    const daCoDau = /<a:t>[^<]*Ms\.Ngọc Elite English/.test(xml) || xml.includes('MNEE Footer');
    if (!daCoDau && xml.includes('</p:spTree>')) {
      xml = xml.replace('</p:spTree>', sp + '</p:spTree>');
      zip.file(nm, xml);
      daDong++;
    } else if (daCoDau) boQua++;
  }

  // ── Ghi bản sao ──
  const raBuf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  chanGhiDeGoc(outFile);                                  // chặn lần nữa ngay trước khi ghi
  fs.writeFileSync(outFile, raBuf);

  // ── Chứng minh file gốc không đổi ──
  const sau = fs.readFileSync(srcAbs);
  const nguyenVen = sau.length === goc.length && sau.equals(goc);

  console.log('slide | số từ | ảnh | chữ nhỏ nhất');
  console.log('------+-------+-----+-------------');
  bang.forEach(b => console.log(
    `  ${String(b.no).padStart(3)} | ${String(b.soTu).padStart(5)} | ${String(b.anh).padStart(3)} | `
    + `${b.nhoNhat === null ? '   —' : (b.nhoNhat + 'pt').padStart(5)}`));

  console.log(`\n${loi.length ? '❌' : '✅'} Luật của cô: ${loi.length} lỗi`);
  loi.slice(0, 20).forEach(x => console.log('   · ' + x));
  console.log(`\n${canXem.length ? '⚠️ ' : '✅'} Cần cô xem: ${canXem.length} chỗ`);
  canXem.slice(0, 20).forEach(x => console.log('   · ' + x.replace(/\*\*/g, '')));
  if (canXem.length > 20) console.log(`   … và ${canXem.length - 20} chỗ nữa, xem trong phiếu chấm`);

  // ── Phiếu chấm ──
  const rp = path.join(outDir, `${ten}__PHIEU-CHAM.md`);
  fs.writeFileSync(rp, [
    `# Phiếu chấm deck — ${path.basename(srcAbs)}`, '',
    `Ms.Ngọc Elite English · ${new Date().toLocaleDateString('vi-VN')}`, '',
    '## File', '',
    `| | |`, `|---|---|`,
    `| Gốc | \`${srcAbs}\` |`,
    `| Bản sao đã sửa | \`${outFile}\` |`,
    `| File gốc sau khi chạy | **${nguyenVen ? 'NGUYÊN VẸN, không bị sửa' : 'ĐÃ THAY ĐỔI — báo ngay cho em'}** |`,
    `| Số slide | ${ten2.length} |`,
    `| Khổ | ${(W / EMU).toFixed(2)} × ${(H / EMU).toFixed(2)} inch |`, '',
    '## Đã sửa gì trên bản sao', '',
    `- Đóng chân trang \`${CHAN_TRANG}\`: **${daDong} slide**`,
    `- Bỏ qua vì đã có sẵn dấu trung tâm: **${boQua} slide**`, '',
    '## Lỗi theo luật của cô — phải sửa', '',
    loi.length ? loi.map(x => `- ${x}`).join('\n') : '_Không có._', '',
    '## Cần cô xem — theo lứa tuổi 5.5 tuổi', '',
    canXem.length ? canXem.map(x => `- ${x}`).join('\n') : '_Không có._', '',
    '## Từng slide', '',
    '| Slide | Số từ | Ảnh | Chữ nhỏ nhất | Nhận xét |',
    '|---|---|---|---|---|',
    ...bang.map(b => {
      const nx = [];
      if (b.soTu > 25) nx.push('quá nhiều chữ');
      if (b.anh === 0 && b.soTu > 0) nx.push('thiếu ảnh');
      if (b.nhoNhat !== null && b.nhoNhat < 24) nx.push('chữ nhỏ');
      return `| ${b.no} | ${b.soTu} | ${b.anh} | ${b.nhoNhat ?? '—'} | ${nx.join(', ') || 'đạt'} |`;
    }),
  ].join('\n'), 'utf8');

  console.log(`\nĐóng dấu chân trang: ${daDong} slide · bỏ qua (đã có sẵn dấu): ${boQua} slide`);
  console.log(`\n✅ Bản sao đã sửa : ${outFile}`);
  console.log(`✅ Phiếu chấm     : ${rp}`);
  console.log(`${nguyenVen ? '✅' : '❌'} File gốc         : ${nguyenVen ? 'NGUYÊN VẸN, không bị sửa' : 'ĐÃ THAY ĐỔI — dừng lại và báo em'}\n`);
  if (!nguyenVen) process.exitCode = 1;
})().catch(e => { console.error('\n✗ ' + e.message + '\n'); process.exitCode = 1; });
