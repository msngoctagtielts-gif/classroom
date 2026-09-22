# Kid's Box Starter → Level 4 — Bộ tài liệu giảng dạy

Ms.Ngọc Elite English · dựng ngày 22/09/2026

---

## Trước hết: về việc tải sách

**Không tải file PDF Kid's Box từ mạng về dùng.** Kid's Box là giáo trình có bản quyền của
Cambridge University Press & Assessment. Các bản PDF trôi nổi đều là bản vi phạm bản quyền, và
một trung tâm dạy học bị phát hiện dùng sách lậu là rủi ro pháp lý lẫn rủi ro thương hiệu.

Bộ tài liệu này đi đường khác:

| Thứ | Nguồn |
|---|---|
| Tên unit, số unit, mức CEFR | Thông tin Cambridge công bố công khai |
| Giáo án, timeline, hoạt động, rubric | Trung tâm tự thiết kế |
| Slide | Trung tâm tự dựng, hệ nhận diện riêng |
| **Từ vựng, mẫu câu, bài nghe, hình ảnh** | **Để trống có nhãn `[SÁCH tr.__]`** — điền từ sách cô đã mua |

Cách hoàn tất: cô chụp trang mục lục và trang bài cần dạy trong Pupil's Book gửi vào đây,
em điền chính xác vào các ô trống. Dùng sách bản quyền của chính mình để soạn bài là hợp pháp.

---

## Nội dung

```
research/kids-box-scope-and-sequence.md   Bản đồ 5 level, exit standard, mức tin cậy từng nguồn
lesson-plans/KIDS_KB-Starter_U01_B01.md   Giáo án đủ 12 mục, Starter Unit 1, bé 5–6 tuổi
slides/KIDS_KB-Starter_U01_B01.pptx       Deck 17 slide, mở bằng PowerPoint
build/                                    Mã dựng slide và bộ kiểm tra tự động
```

## Dùng thế nào

Mở thẳng file `.pptx` trong `slides/` là dạy được. Trên slide có các khung gạch đứt
`[ẢNH: …]` — kéo thả hình từ flashcard vào đó là xong.

**Nếu máy thiếu font thương hiệu** (Playfair Display, Be Vietnam Pro) và dấu tiếng Việt bị lỗi,
dựng lại bản dùng font có sẵn trên mọi máy Windows:

```bash
cd build && npm install
FALLBACK_FONTS=1 node deck-starter-u01.js
```

## Dựng deck cho unit khác

`build/deck-starter-u01.js` là bản mẫu. Copy ra file mới, thay nội dung theo timeline của giáo án
tương ứng, rồi chạy bộ kiểm tra:

```bash
node deck-starter-u01.js                              # dựng + kiểm ngân sách chữ
node audit-deck.js ../slides/<file>.pptx              # soi file thật: cỡ chữ, màu, lề, chồng lấn
node render-preview.js ../slides/<file>.pptx /tmp/x 2,7,12   # xuất ảnh để nhìn bằng mắt
```

`audit-deck.js` đọc thẳng XML bên trong file `.pptx` chứ không đọc mã nguồn dựng ra nó — nên nó
bắt được cả lỗi mà mã nhìn có vẻ đúng. Nó đã bắt được 4 lỗi thật trong lần dựng đầu tiên.

---

## BÁO CÁO KIỂM ĐỊNH — Bộ Kid's Box Starter→4 — 22/09/2026

**KẾT QUẢ: PASS** (sau khi sửa)

| Nhóm | Số lỗi | Đã sửa |
|---|---|---|
| A — chặn giao hàng | 2 | 2 |
| B — văn phong | 0 | — |
| C — sư phạm | 1 | 1 |
| D — thiết kế | 5 | 4 (1 chờ cô) |

### Lỗi nhóm A

- **A1 — số liệu không nguồn.** Cột "Tuổi khuyến nghị", "Số buổi", "Thời lượng dự kiến" ban đầu
  trình bày như số liệu khách quan. Cambridge **không** công bố bảng tuổi theo từng level.
  → Đã gắn nhãn **"giả định thiết kế của trung tâm"** và thêm bảng phân loại nguồn cho mọi con số.
- **A3 — nội dung giáo trình chưa đọc sách gốc.** Tên unit lấy từ nguồn cộng đồng, không phải mục lục sách.
  → Đã thêm mục 6 công khai mức tin cậy từng level, kèm ghi nhận **một nguồn đã trả về sai**
  (gán danh sách unit Level 1 cho Starter; phát hiện nhờ đối chiếu chéo).

### Lỗi nhóm C

- **C4 — thiếu ICQ.** Ba hoạt động dài hơn 3 phút (stage 3, 4, 6) không có ICQ.
  → Đã bổ sung, giờ đủ ICQ cho cả 6 hoạt động dài.

### Lỗi nhóm D

| Lỗi | Phát hiện bằng | Xử lý |
|---|---|---|
| D3 — Gold làm chữ trên nền sáng (dấu `·` ở footer, nhãn stage ở 8 slide) | bộ soi XML | Đổi sang Grey và Navy |
| D — khối tràn lề an toàn 0.6in (footer 14 slide, tiêu đề slide 2) | bộ soi XML | Kéo vào trong lề |
| D — hai khối chữ đè nhau (slide 12: "⏱ 5 phút" đè footer) | render ảnh, nhìn mắt | Dời lên, **và bổ sung phép kiểm tra chồng lấn vào bộ soi** |
| D — tiêu đề canh giữa bị lệch phải | render ảnh, nhìn mắt | Trừ phần thụt trái vào bề rộng |
| **D7 — chưa có file logo** | kiểm tra thủ công | **Chờ cô gửi file logo** (hiện dùng chữ thay logo) |

Kiểm tra đã PASS: D1 ngân sách chữ (17/17 slide), D2 cỡ chữ học viên ≥ 24pt, D4 Burgundy ≤ 1/slide,
D5 dấu tiếng Việt (soi mắt chuỗi "Thấu hiểu để dẫn lối", "Ngọc", "MẪU CÂU"), D6 mọi slide trả lời được
"khiến học viên nói bằng cách nào".

Kiểm tra sư phạm đã PASS: **STT = 70%** (chuẩn ≥ 60%), 2 outcome, hoạt động dài nhất 6 phút
(chu kỳ chú ý ≤ 7 phút), 3 hoạt động vận động, homework 15 phút.

### Một giới hạn phải nói rõ

Máy dựng tài liệu này **không cài LibreOffice Impress**, nên không convert được `.pptx` để xem
đúng như PowerPoint hiển thị. Ảnh kiểm tra là bản dựng lại hình học từ chính XML trong file —
kiểm chứng được vị trí, kích thước, màu, cỡ chữ, chồng lấn, tràn lề. **Không** kiểm chứng được
cách PowerPoint tự ngắt dòng và thay thế font.

→ **Cô mở thử file trên máy sẽ dạy trước khi vào lớp**, xem lướt 17 slide một lượt.
Nếu chữ bị tràn hoặc dấu bị lỗi, chạy lại với `FALLBACK_FONTS=1` như hướng dẫn ở trên.

---

## ĐIỂM CẦN CÔ NGỌC QUYẾT

1. **Đang dùng phiên bản nào?** Kid's Box có 3 phiên bản lưu hành, số unit khác nhau
   (2nd Edition 12 unit, New Generation 8–12 unit). Bản đồ hiện ghi rõ nguồn từng level,
   nhưng cần cô xác nhận để chốt.
2. **Ảnh trang mục lục** của từng cuốn — để em điền các ô `[SÁCH tr.__]` và xác nhận tên unit.
3. **File logo** để thay phần chữ ở slide bìa và slide cuối.
4. **Unit tiếp theo cần dựng deck?** Hiện mới có Starter Unit 1. Cô chọn thứ tự ưu tiên,
   em dựng tiếp theo đúng bản mẫu này.
