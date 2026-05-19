# 🚗 Smart GPLX - Hệ Thống Ôn Thi Giấy Phép Lái Xe Tích Hợp AI

**Smart GPLX** là một hệ thống ôn luyện và thi thử giấy phép lái xe (GPLX) thông minh. Không chỉ dừng lại ở các bài trắc nghiệm thông thường, hệ thống ứng dụng Trí tuệ nhân tạo (AI) để giải thích luật, phân tích hành vi người dùng và cá nhân hóa lộ trình học tập, giúp tối ưu hóa tỷ lệ đỗ cho học viên.

## 🚀 Quick Start 

```bash
# Chạy toàn bộ hệ thống bằng Docker (khuyến nghị)
docker compose up -d

# Hoặc chạy từng phần
# Backend
npm run dev:be

# Frontend
npm run dev:fe

# AI Engine
cd apps/ai-engine && python src/main.py
```

## 🏗️ Kiến Trúc Hệ Thống (Core Modules)

Hệ thống được chia thành 5 phân hệ cốt lõi hoạt động gắn kết:

1. **Authentication & Security (RBAC):** Kiểm soát truy cập dựa trên vai trò và quyền hạn chi tiết (Permissions).
2. **Knowledge & Question Bank:** Ngân hàng câu hỏi thông minh với cơ chế **Soft Delete**.
3. **Exam Engine:** Tự động sinh đề thi theo **Ma trận đề (Exam Matrix)** chuẩn Bộ GTVT.
4. **Execution & Audit:** Ghi lại nhật ký thi chi tiết, phục vụ thống kê và làm dữ liệu đầu vào cho AI.
5. **AI & Analytics:** "Bộ não" của hệ thống với khả năng giải thích luật (LLM) và học tập thích ứng (Adaptive Learning).

---
## 📑 Mục lục
- [🚀 Quick Start](#-quick-start)
- [🏗️ Kiến trúc hệ thống](#️-kiến-trúc-hệ-thống-core-modules)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [⚙️ CI/CD Pipeline](#-cicd-pipeline-github-actions)
- [📁 Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [🌟 Tính năng nổi bật](#-tính-năng-nổi-bật)
- [💻 Cài đặt chi tiết](#-cài-đặt-chi-tiết)
- [📝 Giấy phép](#-giấy-phép)
---

## 🛠️ Công Nghệ Sử Dụng

### **Backend (Node.js/Express)**

* **Framework & Tools:** Express/Fastify, Awilix (Dependency Injection)
* **Language:** TypeScript
* **ORM:** Prisma / TypeORM
* **Architecture:** Clean Architecture & Domain-Driven Design (DDD)
* **Database:** MySQL, MongoDB Atlas & Redis (Caching/Queue)
* **Background Jobs:** BullMQ
* **Testing Framework:** Jest (Integration Testing)
* **Security & Auth:** JWT, Nodemailer
* **API Documentation:** Swagger (OpenAPI 3.0)

### **Frontend (Next.js)**

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **State Management:** Zustand
* **Styling:** Tailwind CSS, Shadcn/UI

### **AI Engine (Python/FastAPI)**

* **Status:** 🛠️ (Đang trong quá trình phát triển)
* **Framework:** FastAPI
* **CV Models:** YOLO (Object Detection), OCR (EasyOCR/PaddleOCR)
* **Logic:** Pydantic, OpenCV, PyTorch/TensorFlow

### **DevOps & Monitoring**

* **Containerization:** Docker & Docker Compose
* **Logging:** Grafana Loki
* **Metrics:** Prometheus & Grafana Dashboard

## 🚀 CI/CD Pipeline (GitHub Actions)

Dự án sử dụng **GitHub Actions** để tự động hóa quy trình phát triển và deploy, đảm bảo code luôn chất lượng cao trước khi merge.

### Tính năng chính của pipeline

* **Linting:** ESLint + Prettier (JS/TS), Ruff/Black (Python).
* **Testing:** Unit & Integration tests (Jest/Vitest cho Frontend/Backend, pytest cho AI).
* **Build:** Tự động build Docker images cho toàn bộ hệ thống.
* **Security Scan:** Quét lỗ hổng (npm audit, pip-audit, Trivy).

### Workflow chính

* **`ci.yml`** — Chạy trên mọi **push** (lint + test + build + scan)
* **`cd.yml`** — Deploy tự động, build và push image lên GHCR

## 📁 Cấu Trúc Thư Mục

Dự án được tổ chức theo mô hình Workspace, tách biệt rõ ràng các môi trường:

### 1. Backend (`node-backend/`)

Tổ chức theo tầng để tách biệt Logic nghiệp vụ và Hạ tầng (Modular Monolith + Clean Architecture):

```text
node-backend/
├── prisma/                               # Quản lý cơ sở dữ liệu MySQL (Prisma ORM)
│   ├── data/                             # File seed dữ liệu mẫu (Mock data)
│   │   ├── exam.seed.ts                  # Ví dụ: Seed dữ liệu đề thi lý thuyết
│   │   └── index.ts
│   └── schema.prisma                     # Định nghĩa Database Schema chính
│
├── public/uploads/                       # Thư mục tĩnh lưu trữ files upload công khai
│
├── src/
│   ├── api/                              # Tầng Trình Bày (Presentation Layer)
│   │   ├── controllers/                  # Tiếp nhận request, gọi service xử lý và trả response
│   │   │   ├── exam-mgmt/                # Ví dụ: Controller điều hướng phân hệ quản lý đề thi
│   │   │   └── index.ts
│   │   ├── middlewares/                  # Các bộ lọc xử lý trung gian (auth, validation, errors...)
│   │   └── routes/                       # Định nghĩa các endpoint API hệ thống
│   │       └── exam-mgmt/                # Ví dụ: Tuyến đường API phân hệ thi
│   │
│   ├── application/                      # Tầng Ứng Dụng (Application Layer)
│   │   ├── dtos/                         # Data Transfer Objects (Chuẩn hóa dữ liệu Request/Response)
│   │   └── services/                     # Business Logic chính của hệ thống (Use Cases)
│   │       ├── cache/                    # Logic lưu trữ bộ nhớ đệm (Redis Leaderboard)
│   │       └── exam-engine/              # Động cơ xử lý logic phòng thi chính
│   │
│   ├── domain/                           # Tầng Nghiệp Vụ Lõi (Core Domain - Chứa entities, interfaces thuần)
│   │
│   ├── infrastructure/                   # Tầng Hạ Tầng (Infrastructure Layer - Phụ thuộc công nghệ)
│   │   ├── database/                     # Quản lý kết nối, mappers và NoSQL
│   │   │   ├── mappers/                  # Chuyển đổi qua lại giữa DB Model và Domain Entity
│   │   │   ├── mongoose/models/          # Schema MongoDB quản lý Active Session tạm thời (TTL)
│   │   │   └── redis/                    # Khởi tạo cấu hình kết nối Redis Client
│   │   ├── logging/                      # Hệ thống ghi nhật ký hoạt động (Winston Logger)
│   │   ├── persistence/                  # Khai báo cấu trúc bản ghi lưu trữ vật lý (Records)
│   │   ├── queues/                       # Hàng đợi tin nhắn xử lý bất đồng bộ (RabbitMQ/BullMQ)
│   │   ├── repositories/                 # Triển khai (Implement) các Interface dữ liệu từ Domain
│   │   │   ├── exam-mgmt/                # Ví dụ: Cụ thể hóa các truy vấn MySQL cho phân hệ thi
│   │   │   └── repository-proxy.ts       # Proxy điều phối cơ chế truy vấn/ghi dữ liệu
│   │   └── security/                     # Quản lý bảo mật (Cấp phát/Xác thực mã JWT Token)
│   │
│   ├── shared/                           # Các module dùng chung xuyên suốt toàn dự án
│   │   ├── config/                       # Quản lý và nạp cấu hình biến môi trường (.env)
│   │   ├── errors/                       # Định nghĩa và chuẩn hóa mã lỗi tập trung
│   │   └── utils/                        # Các hàm tiện ích bổ trợ hệ thống
│   │
│   ├── app.ts                            # Khởi tạo và cấu hình ứng dụng Express
│   └── server.ts                         # Khởi động server (Listen Port)
│
├── storage/temp/                         # Lưu trữ tệp tin tạm thời trong bộ nhớ đệm
└── tests/                                # Viết các kịch bản kiểm thử tích hợp (Integration Test Backend)

```

### 2. Frontend (`nextjs-frontend/`)

Dự án được xây dựng với **Next.js App Router**, tổ chức theo tính năng (Feature-Driven Development):

```text
nextjs-frontend/
├── public/                               # Chứa tài nguyên tĩnh công khai (Hình ảnh, Icons, Fonts)
│
├── src/
│   ├── api/                              # Cấu hình tầng gọi API hệ thống hoặc Next.js Route Handlers
│   │   ├── auth/
│   │   └── master-data.api/
│   │
│   ├── app/                              # Tầng Định Tuyến chính (Next.js App Router)
│   │   ├── (auth)/                       # Route Group: Các trang xác thực (Đăng nhập, Đăng ký)
│   │   ├── (dashboard)/                  # Route Group: Giao diện quản trị, bảng điều khiển admin
│   │   ├── (home)/                       # Route Group: Trang chủ và không gian của thí sinh
│   │   ├── layout.tsx                    # Khung bố cục gốc toàn hệ thống (Root Layout)
│   │   └── globals.css                   # Định hình phong cách, cấu hình Tailwind & Emerald Palette
│   │
│   ├── components/
│   │   └── common/                       # Thành phần giao diện dùng chung (Shared/Generic Components)
│   │       ├── Form/                     # Các ô nhập liệu chuẩn hóa (Input, Select, Validation)
│   │       ├── Generic-Table/            # Bộ khung bảng hiển thị dữ liệu động nâng cao
│   │       ├── Modals/ / Loaders/        # Các hộp thoại thông báo và hiệu ứng tải trang
│   │       └── Header.tsx / Sidebar.tsx  # Thanh điều hướng và thanh bảng chọn chính
│   │
│   ├── features/                         # Tầng Tính Năng lõi (Mỗi thư mục con là một phân hệ độc lập)
│   │   ├── admin-users/                  # Ví dụ cụ thể Phân hệ: Quản lý người dùng dành cho Admin
│   │   │   ├── api/                      # Các hàm gọi endpoint API riêng của phân hệ này
│   │   │   ├── components/               # Giao diện đặc thù chỉ phục vụ cho việc quản lý user
│   │   │   ├── hooks/                    # Custom Hooks xử lý Logic trạng thái (State) riêng
│   │   │   ├── schema/                   # Định nghĩa cấu trúc kiểm tra dữ liệu đầu vào (Zod Schema)
│   │   │   ├── services/                 # Xử lý, biến đổi định dạng dữ liệu thô trước khi render
│   │   │   └── types/                    # Khai báo các kiểu dữ liệu (TypeScript types/interfaces) riêng
│   │   ├── ai-analysis/                  # Phân hệ phân tích kết quả bằng trí tuệ nhân tạo
│   │   ├── ai-camera/                    # Phân hệ xử lý giám sát thi qua camera trực tuyến
│   │   ├── exam-management/              # Phân hệ quản trị và thiết lập ma trận đề thi GPLX
│   │   └── gplx-test/                    # Phân hệ giao diện làm bài thi lý thuyết trực tuyến
│   │
│   ├── layouts/                          # Các khung Layout bọc ngoài (Layout Admin, Layout Học viên)
│   ├── providers/                        # Nơi cấu hình và bọc các bộ quản lý trạng thái (Zustand, Query)
│   ├── ui/                               # Các mảnh ghép giao diện nguyên bản nguyên tử (Primitives UI)
│   │
│   ├── constants/                        # Lưu trữ các biến hằng số, thông điệp tĩnh toàn cục
│   ├── context/                          # Các luồng truyền dữ liệu xuyên suốt bằng React Context
│   ├── hooks/                            # Kho chứa Custom Hooks toàn cục hệ thống (useAuth, useDebounce...)
│   ├── lib/                              # Khởi tạo các thư viện bên thứ 3 (Axios instance, Tailwind Merge)
│   └── middlewares/                      # Kiểm tra quyền truy cập route trực tiếp từ phía Frontend

```

### 3. AI Engine (`apps/ai-engine/`)

Thiết kế theo chuẩn MLOps:

* `data/`: Quản lý dữ liệu ảnh (Raw/Processed).
* `models/`: Lưu trữ Model Weights (.pth, .onnx).
* `notebooks/`: Môi trường nghiên cứu và thử nghiệm (EDA, Training).
* `src/services`: Logic xử lý chính (Detector, OCR, Validator).


## 🛠️ Hướng Dẫn Cài Đặt & Vận Hành

### 📋 Yêu cầu hệ thống

* **Node.js**: v20+
* **Python**: 3.9+
* **Docker & Docker Desktop**

---

### 🚀 Các bước khởi chạy dự án (Local Development)

**1. Clone dự án và di chuyển vào thư mục gốc:**

```bash
git clone [https://github.com/khanhtrinh150703/SMART-GPLX-SYSTEM](https://github.com/khanhtrinh150703/SMART-GPLX-SYSTEM)
cd SMART-GPLX-SYSTEM

```

**2. Cài đặt toàn bộ Dependencies cho Workspace:**
*(Chỉ cần chạy một lệnh duy nhất tại thư mục gốc để cài cho cả Frontend và Backend)*

```bash
npm install
```

**3. Khởi động các database:**

```bash
docker compose up -d
```

**4. Khởi chạy Backend:**

```bash
npm run dev:be
```

**5. Khởi chạy Frontend:**

```bash
npm run dev:fe
```

**6. Khởi chạy AI Engine (Mở một Terminal độc lập):**

```bash
cd apps/ai-engine
pip install -r requirements.txt
python src/main.py
```

---

### 🧪 Kiểm tra chất lượng Code & Testing (Tự động hóa với Husky & act)

Hệ thống tự động kích hoạt quy trình kiểm duyệt chất lượng mã nguồn nghiêm ngặt ngay dưới máy local thông qua **Husky** và **act**:

* **Khi Commit (`git commit`):** Husky tự động chạy bộ kiểm tra lỗi kỹ thuật nhanh (Type-check & Linter cho cả FE và BE) để đảm bảo code sạch lỗi cú pháp trước khi lưu:

```bash
npm run verify
```

* **Khi Push (`git push`):** Husky tự động sử dụng công cụ **`act`** để giả lập môi trường GitHub Actions, chạy duy nhất file workflow `ci.yml` nhằm thực thi toàn bộ các bài kiểm thử tích hợp (Integration Test bằng Jest) của Backend:

```bash
act -W .github/workflows/ci.yml --rm --container-architecture linux/amd64
```

---

### 🐳 Triển khai nhanh bằng Docker

Nếu muốn test thử các bản đóng gói Image tĩnh dưới máy local giống như môi trường deploy thật, sử dụng cụm lệnh sau tại thư mục gốc:

```bash
# Build các Docker Image
docker build -t smart-be -f Dockerfile.backend .
docker build -t smart-fe -f Dockerfile.frontend .

# Khởi chạy hệ thống container
docker compose up -d                               # Bật database dưới nền
docker run -d -p 5000:5000 --name web-be smart-be  # Chạy Backend (Port 5000)
docker run -d -p 3000:3000 --name web-fe smart-fe  # Chạy Frontend (Port 3000)
```

---

## 📝 Giấy Phép

Dự án được phân phối dưới giấy phép MIT License.

