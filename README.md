# 🚗 Smart GPLX - Hệ Thống Ôn Thi Giấy Phép Lái Xe Tích Hợp AI

**Smart GPLX** là một hệ thống ôn luyện và thi thử giấy phép lái xe (GPLX) thông minh. Không chỉ dừng lại ở các bài trắc nghiệm thông thường, hệ thống ứng dụng Trí tuệ nhân tạo (AI) để giải thích luật, phân tích hành vi người dùng và cá nhân hóa lộ trình học tập, giúp tối ưu hóa tỷ lệ đỗ cho học viên.

---

## 🏗️ Kiến Trúc Hệ Thống (Core Modules)

Hệ thống được chia thành 5 phân hệ cốt lõi hoạt động gắn kết:

1. **Authentication & Security (RBAC):** Kiểm soát truy cập dựa trên vai trò và quyền hạn chi tiết (Permissions).
2. **Knowledge & Question Bank:** Ngân hàng câu hỏi thông minh với cơ chế **Soft Delete** và **Cron Job** để tối ưu hóa dữ liệu lịch sử.
3. **Exam Engine:** Tự động sinh đề thi theo **Ma trận đề (Exam Matrix)** chuẩn Bộ GTVT.
4. **Execution & Audit:** Ghi lại nhật ký thi chi tiết, phục vụ thống kê và làm dữ liệu đầu vào cho AI.
5. **AI & Analytics:** "Bộ não" của hệ thống với khả năng giải thích luật (LLM) và học tập thích ứng (Adaptive Learning).

---

## 🛠️ Công Nghệ Sử Dụng

### **Backend (Node.js/Express)**

* **Language:** TypeScript
* **ORM:** Prisma / TypeORM
* **Architecture:** Clean Architecture (Domain-Driven Design focus)
* **Database:** PostgreSQL / MySQL

### **Frontend (React)**

* **Framework:** React + Vite
* **Language:** TypeScript
* **State Management:** Zustand / Redux Toolkit
* **Styling:** Tailwind CSS / SCSS

### **AI Engine (Python/FastAPI)**

* **Framework:** FastAPI
* **CV Models:** YOLO (Object Detection), OCR (EasyOCR/PaddleOCR)
* **Logic:** Pydantic, OpenCV, PyTorch/TensorFlow

---

## 📁 Cấu Trúc Thư Mục

Dự án được tổ chức theo mô hình Monorepo hoặc tách biệt 3 Repo chính:

### 1. Backend (`smart-gplx-backend/`)

Tổ chức theo tầng để tách biệt Logic nghiệp vụ và Hạ tầng:

* `src/api`: Tầng giao tiếp (Controllers, Routes, Middlewares).
* `src/application`: Xử lý nghiệp vụ (Services, DTOs).
* `src/domain`: Tầng lõi (Entities, Interfaces).
* `src/infrastructure`: Kết nối bên ngoài (Database, AI Client, Storage).

### 2. Frontend (`react-enterprise-boilerplate/`)

Tổ chức theo tính năng (Feature-based):

* `src/features`: Mỗi tính năng (Thi thử, Lịch sử, Tài khoản) nằm trong một folder riêng biệt.
* `src/components`: Các UI Component dùng chung (Atom/Molecule).
* `src/store`: Quản lý State toàn cục.

### 3. AI Engine (`ai-engine/`)

Thiết kế theo chuẩn MLOps:

* `data/`: Quản lý dữ liệu ảnh (Raw/Processed).
* `models/`: Lưu trữ Model Weights (.pth, .onnx).
* `notebooks/`: Môi trường nghiên cứu và thử nghiệm (EDA, Training).
* `src/services`: Logic xử lý chính (Detector, OCR, Validator).

---

## 🚀 Tính Năng Nổi Bật

### 🧠 Trợ lý AI Thông Minh

* **Giải thích luật:** Sử dụng LLM để giải thích các câu hỏi khó, hình ảnh sa hình phức tạp.
* **Caching Lời giải:** Để tối ưu chi phí API AI, các lời giải đã sinh ra được cache vào Database cho người dùng sau.
* **Adaptive Learning:** Hệ thống tự phát hiện "vùng kiến thức yếu" của người dùng để gợi ý bài tập trọng tâm.

### 🧹 Cơ chế Xóa mềm (Soft Delete) & Cleanup

Hệ thống không xóa vĩnh viễn dữ liệu ngay lập tức để bảo toàn lịch sử thi:

1. **Soft Delete:** Đánh dấu `deleted_at`.
2. **Cron Job:** Tác vụ chạy ngầm 2 giờ sáng hàng ngày để quét và chuyển dữ liệu cũ vào **Archive** nếu không còn ràng buộc.

---

## 🛠️ Cài Đặt

### Yêu cầu hệ thống:

* Node.js v18+
* Python 3.9+
* Docker (tùy chọn)

### Các bước thực hiện:

1. **Clone dự án:**
```bash
git clone https://github.com/your-username/smart-gplx.git
```


2. **Cài đặt Backend:**
```bash
cd smart-gplx-backend
npm install
npx prisma migrate dev
npm run dev
```


3. **Cài đặt Frontend:**
```bash
cd react-enterprise-boilerplate
npm install
npm run dev
```


4. **Cài đặt AI Engine:**
```bash
cd ai-engine
pip install -r requirements.txt
python src/main.py
```



---

## 📝 Giấy Phép
MIT
---


