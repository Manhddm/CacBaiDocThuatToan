# Website Các Bài Đọc Thuật Toán

Website này chuyển đổi các bài đọc thuật toán thành giao diện web hiện đại với nội dung được cấu trúc dưới dạng JSON thay vì README.md files.

## 🆕 Thay đổi mới

- ✅ **Không còn phụ thuộc vào README.md**: Nội dung được lưu trữ dưới dạng JSON có cấu trúc
- ✅ **Hiển thị đẹp hơn**: Các thành phần được thiết kế riêng biệt (code, công thức, ví dụ...)
- ✅ **Dễ bảo trì**: Thêm/sửa bài viết chỉ cần chỉnh sửa file JSON
- ✅ **Metadata phong phú**: Mỗi bài có thông tin về độ khó, thời gian đọc, tags...
- ✅ **README làm tài liệu tham khảo**: README giờ chỉ dùng để ghi chú và tham khảo

## Tính năng

- 🎯 Giao diện đẹp mắt và dễ sử dụng
- 📱 Responsive design (tương thích mobile)
- 🔍 Navigation sidebar với cấu trúc rõ ràng
- 💻 Syntax highlighting cho code
- 🧮 Hỗ trợ hiển thị công thức toán học (MathJax)
- ⚡ Tải nhanh với cache
- � Metadata chi tiết cho từng bài viết
- 🏷️ System tags và phân loại

## Cách chạy

### Phương pháp 1: Sử dụng Node.js (Khuyến nghị)

1. Mở terminal/command prompt
2. Di chuyển đến thư mục website:
```bash
cd "c:\Users\manhd\OneDrive - University of Transport and Communications\Máy tính\CacBaiDocThuatToan\website"
```

3. Chạy server:
```bash
node server.js
```

4. Mở trình duyệt và truy cập: http://localhost:3000

### Phương pháp 2: Sử dụng Python (Nếu có Python)

```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

## Cấu trúc thư mục

```
website/
├── content/                # Nội dung bài viết (JSON)
│   ├── index.json         # Cấu trúc và metadata tổng thể
│   ├── stack-queue.json   # Bài viết về Stack & Queue
│   ├── extended-gcd.json  # Thuật toán Euclid mở rộng
│   └── ...               # Các bài viết khác
├── index.html            # Trang chính
├── styles.css            # CSS styling
├── script.js             # JavaScript logic
├── server.js             # Node.js server
├── package.json          # Node.js dependencies
└── README.md            # Tài liệu này
```

## Thêm bài viết mới

### Bước 1: Tạo file JSON cho bài viết

Tạo file `content/ten-bai-viet.json` với cấu trúc:

```json
{
  "title": "Tiêu đề bài viết",
  "category": "Đại Số", 
  "subcategory": "Nguyên Tắc Cơ Bản",
  "difficulty": "Trung bình",
  "timeToRead": "15 phút",
  "tags": ["tag1", "tag2"],
  "lastUpdated": "2025-08-17",
  "content": {
    "introduction": {
      "title": "Giới thiệu",
      "text": "Mô tả ngắn gọn...",
      "note": "Ghi chú nếu có"
    },
    "sections": [
      {
        "title": "Phần 1",
        "content": [
          {
            "type": "text",
            "content": "Nội dung text"
          },
          {
            "type": "code",
            "language": "cpp",
            "content": "// Code example\nint main() {\n  return 0;\n}"
          },
          {
            "type": "formula",
            "content": "$$a^2 + b^2 = c^2$$"
          }
        ]
      }
    ],
    "exercises": [...],
    "references": [...]
  }
}
```

### Bước 2: Cập nhật navigation

Thêm link vào `index.html`:

```html
<li><a href="#" onclick="loadArticle('ten-bai-viet')">Tiêu đề bài viết</a></li>
```

### Các loại content được hỗ trợ:

- `text`: Đoạn văn bản thông thường
- `code`: Code block với syntax highlighting
- `formula`: Công thức toán học (LaTeX)
- `example`: Ví dụ minh họa
- `algorithm`: Thuật toán với các bước
- `operations`: Các thao tác với code
- `complexity`: Độ phức tạp thuật toán
- `note`: Ghi chú quan trọng
- `subtitle`: Tiêu đề phụ

## Tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa biến CSS trong `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --accent-color: #3b82f6;
    /* ... các biến khác */
}
```

### Thêm loại content mới
Cập nhật hàm `renderContentItem()` trong `script.js`

## Hỗ trợ

- ✅ Chrome, Firefox, Safari, Edge (các phiên bản hiện đại)
- ✅ Mobile browsers
- ✅ LaTeX math expressions với MathJax
- ✅ Code syntax highlighting với Prism.js
- ✅ Structured JSON content
- ✅ Rich metadata và tags

## Giấy phép

MIT License - Xem file LICENSE để biết thêm chi tiết.
