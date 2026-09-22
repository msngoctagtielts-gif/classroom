'use strict';
/**
 * Hệ nhận diện Ms.Ngọc Elite English — dùng chung cho mọi deck.
 * Thông số lấy nguyên từ skill `deck-elite` (references/brand-system.md).
 *
 * Font: mặc định dùng font thương hiệu. Nếu máy giáo viên thiếu font và dấu tiếng Việt
 * bị lỗi, thêm cờ --fallback để đổi sang Georgia + Calibri (có sẵn trên mọi máy
 * Windows/Office):   npm run build:fallback
 */

// Nhận cả cờ dòng lệnh --fallback (chạy được trên Windows cmd) lẫn biến môi trường.
const FALLBACK = process.argv.includes('--fallback') || process.env.FALLBACK_FONTS === '1';

const C = {
  navy:     '0F2A4A',
  gold:     'C9A227',
  white:    'FFFFFF',
  ivory:    'F5F2EA',
  burgundy: '7B2233',
  ink:      '1A1A1A',
  grey:     '6B7280',
};

const F = {
  title: FALLBACK ? 'Georgia' : 'Playfair Display',
  body:  FALLBACK ? 'Calibri' : 'Be Vietnam Pro',
};

// Khổ 16:9 — 13.333 x 7.5 inch, lề an toàn 0.6 inch
const PAGE = { w: 13.333, h: 7.5, margin: 0.6 };
const CONTENT_W = PAGE.w - PAGE.margin * 2;   // 12.133

// Thang khoảng cách dọc của hệ thiết kế (px → inch @96dpi)
const SP = { xs: 8 / 96, sm: 16 / 96, md: 24 / 96, lg: 40 / 96, xl: 64 / 96 };

/** Cỡ chữ — bản Kids nâng sàn lên 24pt theo slide-patterns.md */
const SIZE = {
  target: 44,   // từ/mẫu câu mục tiêu (sàn 40)
  h1:      40,
  body:    28,  // nội dung chính
  labelSm: 20,
  caption: 18,  // sàn tuyệt đối 16 — Kids là 24 cho nội dung học
  kidsMin: 24,
};

/** Nền Ivory (mặc định cho deck Kids — trẻ nhỏ thấy nền tối kém hấp dẫn) */
function bgIvory(slide) { slide.background = { color: C.ivory }; }
function bgWhite(slide) { slide.background = { color: C.white }; }
function bgNavy(slide)  { slide.background = { color: C.navy }; }

/** Thanh Gold nhấn ở mép trái slide nội dung */
function goldBar(slide, pptx) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.18, h: PAGE.h, fill: { color: C.gold },
  });
}

/** Số trang + tên trung tâm ở chân slide */
function footer(slide, pageNo) {
  slide.addText(
    [
      { text: 'Ms.Ngọc Elite English', options: { color: C.grey } },
      // Dấu phân cách dùng Grey, KHÔNG dùng Gold: Gold trên nền sáng chỉ đạt 2.42:1 (trượt WCAG)
      { text: '   ·   ', options: { color: C.grey } },
      { text: String(pageNo), options: { color: C.grey, bold: true } },
    ],
    { x: PAGE.margin, y: PAGE.h - 0.95, w: CONTENT_W, h: 0.3,
      fontFace: F.body, fontSize: SIZE.caption, align: 'right' }
  );
}

/** Nhãn stage nhỏ ở góc trên trái (giáo viên định vị nhanh khi dạy) */
function stageTag(slide, text) {
  slide.addText(text.toUpperCase(), {
    x: PAGE.margin, y: 0.42, w: 6, h: 0.32,
    fontFace: F.body, fontSize: SIZE.caption, bold: true,
    // Navy (14.48:1) chứ không phải Gold: nhãn này nằm trên nền sáng
    color: C.navy, charSpacing: 2,
  });
}

/**
 * Khung ảnh chờ — chỗ giáo viên thả hình minh họa nghĩa vào.
 * Deck Kids bắt buộc có hình: trẻ 5 tuổi chưa đọc được chữ.
 */
function imageSlot(slide, pptx, { x, y, w, h, label }) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.12,
    fill: { color: C.white },
    line: { color: C.gold, width: 2, dashType: 'dash' },
  });
  slide.addText(`[ẢNH: ${label}]`, {
    x, y: y + h / 2 - 0.25, w, h: 0.5,
    fontFace: F.body, fontSize: SIZE.caption, color: C.grey, align: 'center',
  });
}

/** Đếm từ hiển thị — dùng cho kiểm tra ngân sách chữ */
function countWords(s) {
  return String(s).trim().split(/\s+/).filter(Boolean).length;
}

module.exports = {
  C, F, PAGE, CONTENT_W, SP, SIZE, FALLBACK,
  bgIvory, bgWhite, bgNavy, goldBar, footer, stageTag, imageSlot, countWords,
};
