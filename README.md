# Kid's Box 1 → 4 — Bộ tài liệu giảng dạy

Ms.Ngọc Elite English · cho bé **từ 5 tuổi rưỡi** · lớp giao tiếp

---

## Chạy trên máy của cô

### Cách nhanh nhất — một nhấp đúp

1. Tải cả thư mục này về máy (nút **Code → Download ZIP** trên GitHub), giải nén.
2. Cài **Node.js** bản LTS ở https://nodejs.org — chỉ cài một lần.
3. Nhấp đúp vào **`CHAY-TREN-MAY.bat`**.

File `.bat` tự làm hết: cài thư viện, quét kho giáo trình, dựng slide, soi lỗi slide.

Nếu kho sách của cô **không** nằm ở `D:\KHO-MSNGOC\1_NOI-BO\01_NGUON-NXB\KIDS-BOX`,
cô mở `CHAY-TREN-MAY.bat` bằng Notepad và sửa **dòng thứ 6**.

### Muốn gõ lệnh

```bash
cd build
npm install                                  # lần đầu
npm run scan                                 # quét kho giáo trình
npm run build                                # dựng slide
npm run audit                                # soi file .pptx vừa dựng
```

Nếu dấu tiếng Việt trên slide bị lỗi vì máy thiếu font thương hiệu:

```bash
npm run build:fallback                       # đổi sang Georgia + Calibri
```

### Muốn Claude chạy thẳng trên máy cô

Phiên này chạy trên máy chủ đám mây nên **không đọc được ổ `D:`**. Muốn em đọc thẳng kho của cô,
cô cài **Claude Code** trên máy Windows rồi mở nó ngay trong thư mục kho. Khi đó em đọc file
trực tiếp, không cần cô gửi gì cả.

Còn nếu vẫn dùng phiên đám mây: chạy `npm run scan`, rồi kéo file
`research/kho-inventory.json` vào khung chat. Em biết kho có đúng những gì.

---

## Có gì trong này

```
research/
  kids-box-1-4-kien-truc.md        ★ Kiến trúc 4 cuốn đã điều chỉnh — đọc file này trước
  phan-tich-do-tuoi-va-mat-xich.md   Vì sao bé 5.5 tuổi không vào thẳng KB1
  kids-box-scope-and-sequence.md     Bản đồ giáo trình, mức tin cậy từng nguồn
  kho-inventory.json                 (sinh ra sau khi chạy npm run scan)

lesson-plans/
  KIDS_KB1_U01_L01.md              Giáo án đủ 12 mục · KB1 U1 L1 tr.4–5 · STT 68.8%

slides/
  KIDS_KB1_U01_L01.pptx            Deck 17 slide, mở bằng PowerPoint là dạy được

build/
  scan-kho.js                      Quét kho, rút cấu trúc từ tên file
  deck.js                          Bộ dựng slide (không cần sửa)
  lessons/kb1-u01-l01.js           Dữ liệu một bài — copy file này để thêm bài mới
  brand.js                         Hệ màu, font, lưới
  audit-deck.js                    Soi file .pptx
  render-preview.js                Xuất ảnh slide để nhìn bằng mắt
```

---

## Thêm một bài mới

Không sửa `deck.js`. Chỉ cần:

```bash
cd build/lessons
copy kb1-u01-l01.js kb1-u01-l02.js      # Windows
```

Mở file mới, sửa `meta` và mảng `slides`, rồi chạy:

```bash
node ../deck.js lessons/kb1-u01-l02.js
node ../audit-deck.js ../../slides/KIDS_KB1_U01_L02.pptx
```

Mỗi slide khai báo một trường `speak` — *"slide này khiến bé nói bằng cách nào?"*.
Nếu không trả lời được câu đó thì xóa slide, đừng giữ.

---

## Về sách gốc

**Không tải PDF Kid's Box từ mạng.** Kid's Box có bản quyền của Cambridge University Press;
bản PDF trôi nổi đều là bản vi phạm, và một trung tâm dạy học dùng sách lậu là rủi ro pháp lý
lẫn thương hiệu. Dùng **sách bản quyền cô đã mua** để soạn bài thì hợp pháp.

Trong tài liệu, mọi chỗ ghi `[SÁCH tr.__]` là **ô chờ** — nội dung ngôn ngữ của sách
(từ vựng, mẫu câu, lời bài hát, số track) chưa được điền vì chưa đọc được sách.
Slide cũng không chiếu lại trang sách; các khung gạch đứt `[ẢNH: …]` là chỗ cô thả hình
flashcard của mình vào.

---

## Bộ soi slide

`audit-deck.js` đọc thẳng **XML bên trong file `.pptx` đã xuất**, không đọc mã dựng ra nó —
nên nó bắt được cả lỗi mà mã nhìn có vẻ đúng. Nó kiểm:

| Luật | Kiểm gì |
|---|---|
| Cỡ chữ | Chữ **bé đọc** phải ≥ 24pt. Chữ cho cô (nhãn stage, footer, ô chờ ảnh) được 18pt. |
| Tương phản | Gold `#C9A227` **không được** làm chữ trên nền sáng — chỉ đạt 2.42:1, trượt WCAG |
| Burgundy | Tối đa 1 lần mỗi slide |
| Lề an toàn | 0.6 inch mỗi cạnh |
| Chồng lấn | Hai khối chữ không được đè nhau |
| Ngân sách chữ | Slide hoạt động nói ≤ 12 từ, giới thiệu ngôn ngữ ≤ 20, hướng dẫn ≤ 25 |

Nó đã bắt được **6 lỗi thật** qua hai vòng dựng: chữ Gold trên nền sáng ở 9 slide,
khối tràn lề ở 14 slide, "⏱ 5 phút" đè lên footer, tiêu đề canh giữa bị lệch,
và một chỗ chính luật của em phân loại sai nhãn stage.

**Giới hạn phải nói rõ:** máy dựng không cài LibreOffice Impress nên không render được `.pptx`
đúng như PowerPoint hiển thị. Ảnh kiểm tra là bản dựng lại hình học từ XML — đúng về vị trí,
màu, cỡ chữ, chồng lấn, nhưng **không** kiểm được cách PowerPoint tự ngắt dòng và thay font.
Cô mở thử trên máy sẽ dạy, lướt 17 slide một lượt trước khi vào lớp.

---

## Việc còn lại

| # | Việc | Ai |
|---|---|---|
| 1 | Chạy `CHAY-TREN-MAY.bat`, gửi em `kho-inventory.json` | Cô |
| 2 | Xác nhận **KB2 có bao nhiêu unit** ở bản New Generation | Cô |
| 3 | Gửi ảnh trang mục lục 4 cuốn | Cô |
| 4 | Điền toàn bộ ô `[SÁCH tr.__]` | Em |
| 5 | Dựng 4 bộ cầu nối K1–K4 | Em |
| 6 | Dựng đề thi Kids từng chặng | Em |
| 7 | Quyết nhóm 5.5 tuổi: mua Starter hay dựng Kids L0 | Cô — **đang gác lại** |
