'use strict';
/**
 * Kid's Box 1 (New Generation) · Unit 1 · Lesson 1 · trang 4–5
 * Lớp Kids 5.5–6 tuổi · 45 phút · buổi 1 của chặng KB1A
 *
 * ⚠️ NGÔN NGỮ CỦA SÁCH CHƯA ĐIỀN. Em chưa đọc được trang 4–5 của Pupil's Book.
 *    Mọi chỗ ghi [SÁCH tr.4-5] là ô chờ. Khung mẫu câu dưới đây là thiết kế của
 *    trung tâm, dùng được ngay, nhưng phải đối chiếu lại với sách.
 *
 * Số trang lấy từ chính tên file trong kho của cô: "KIDS BOX 1 UNIT 1 LESSON 1 P4-5".
 */
module.exports = {
  meta: {
    tenFile: 'KIDS_KB1_U01_L01',
    tieuDe: "Kid's Box 1 · Unit 1 · Lesson 1 (tr.4–5)",
    level: 'KB1A', unit: 1, lesson: 1, trang: '4-5',
    tuoi: '5.5–6', phut: 45,
  },

  slides: [
    { kieu: 'cover',
      tieuDe: 'Hello!',
      dong2: "Kid's Box 1  ·  Unit 1  ·  Lesson 1  ·  tr.4–5",
      dong3: 'Lớp Kids 5.5–6 tuổi  ·  45 phút  ·  Ms.Ngọc Elite English' },

    { kieu: 'canDo', items: ['say hello', 'say my name'] },

    // ── Điều chỉnh độ tuổi #4: Sound Start — vá chỗ KB1 giả định bé đã biết chữ cái
    { kieu: 'imageGrid', stage: 'Sound Start · 5 phút',
      tieuDe: 'Listen and say',
      o: ['chữ A + ảnh từ bắt đầu bằng /æ/', 'chữ B + ảnh từ bắt đầu bằng /b/'],
      ghiChu: 'Cô đọc âm, bé nhắc lại và làm động tác miệng. Chưa yêu cầu bé đọc chữ.',
      speak: 'Bé nhắc lại âm và gọi tên hình — xây nền ngữ âm trước khi gặp chữ' },

    { kieu: 'song', stage: 'Stage 1 · Hello song · 4 phút',
      tieuDe: 'Sing with me!',
      audio: '[SÁCH — track Unit 1 Lesson 1, số __]',
      anh: 'nhân vật Unit 1 đang vẫy tay',
      speak: 'Bé hát và làm động tác — hát không bị coi là bị hỏi bài' },

    { kieu: 'imageGrid', stage: 'Stage 2 · Listen and point · 6 phút',
      tieuDe: 'Listen and point',
      o: ['[SÁCH tr.4] nhân vật 1', '[SÁCH tr.4] nhân vật 2',
          '[SÁCH tr.5] nhân vật 3', '[SÁCH tr.5] nhân vật 4'],
      ghiChu: '[SÁCH — track "Listen and point", số __]',
      speak: 'Bé chỉ vào hình rồi nhắc lại tên — nối âm với hình trước khi phải tự nói' },

    { kieu: 'target', stage: 'Stage 3 · Mẫu câu 1',
      cau: 'Hello!', anh: 'bé vẫy tay chào',
      speak: 'Bé đọc to mẫu và vẫy tay — gắn câu với cử chỉ' },

    { kieu: 'target', stage: 'Stage 3 · Mẫu câu 2',
      cau: "I'm ", gold: '________', anh: 'nhân vật tự giới thiệu',
      speak: 'Bé thay phần Gold bằng tên của chính mình — câu đầu tiên bé sở hữu' },

    { kieu: 'tpr', tu: 'WAVE!', phu: 'Stand up  ·  Wave  ·  Say hello',
      speak: 'Cả lớp đứng dậy làm động tác và nói to — vận động lần 1' },

    { kieu: 'game', stage: 'Stage 5 · Name circle · 6 phút',
      tieuDe: 'Catch the ball!',
      cau: "Hello! I'm ", gold: '______', emoji: '⚽',
      speak: 'Bắt bóng là phải nói tên — lần đầu bé tự sản sinh mẫu câu mục tiêu' },

    { kieu: 'imageGrid', stage: 'Stage 6 · Point and say · 5 phút',
      tieuDe: 'Who is it?',
      o: ['[SÁCH tr.4] từ 1', '[SÁCH tr.4] từ 2', '[SÁCH tr.5] từ 3', '[SÁCH tr.5] từ 4'],
      ghiChu: 'Cô chỉ nhanh dần — biến thành trò chơi tốc độ',
      speak: 'Bé gọi tên khi cô chỉ — tăng tốc dần để tạo phản xạ, đo Can-Do 2' },

    { kieu: 'game', stage: 'Stage 7 · Hide and guess · 5 phút',
      tieuDe: 'Guess!',
      cau: 'Is it ', gold: '______', sau: '?', emoji: '🙈',
      speak: 'Bé phải ĐẶT câu hỏi để đoán — đạt luật "tự đặt ≥ 1 câu hỏi mỗi buổi" của KB1' },

    { kieu: 'taskInstruction', phut: 5,
      buoc: ['Look at the friend.', 'Say hello.', 'Say your name.'],
      speak: 'Rõ nhiệm vụ thì bé không mất thời gian hỏi lại — dành trọn 5 phút để nói' },

    { kieu: 'taskPrompt', tieuDe: 'Meet my three friends',
      o: ['bạn 1', 'bạn 2', 'bạn 3'],
      speak: 'Gần như không chữ — không có gì để đọc, chỉ còn cách nói' },

    { kieu: 'useful', tieuDe: 'If you forget…',
      cum: ['Hello!', "I'm ______.", 'Again, please.'],
      speak: 'Gỡ bí khi bé đứng hình — đặc biệt quan trọng với bé rụt rè buổi đầu' },

    { kieu: 'feedback', tieuDe: 'Say it again, better',
      goiY: '[Cô gõ trực tiếp câu cần sửa vào đây — KHÔNG ghi tên bé]',
      speak: 'Cả lớp cùng đọc lại câu đúng — delayed correction, không ngắt lời bé' },

    // ── Điều chỉnh độ tuổi #5: bài về nhà là quay video, không phải bài viết
    { kieu: 'homework',
      viec: [
        ['Hát lại bài Unit 1', '2 lần  ·  5 phút'],
        ['Quay video 15 giây: chào 3 người trong nhà', 'Gửi Zalo lớp  ·  5 phút'],
        ['Tô màu chữ A và B', 'Mang khoe buổi sau  ·  5 phút'],
      ],
      speak: 'Cô hỏi ICQ về bài tập, bé nhắc lại yêu cầu bằng lời' },

    { kieu: 'closing' },
  ],
};
