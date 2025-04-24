🏗️ Capstone 2 - Chatbot Application

🚀 Ứng dụng Chatbot sử dụng React, TypeScript và Tailwind CSS  
Hỗ trợ tìm kiếm thông tin dựa trên hội thoại giữa người dùng và chatbot.

---

📌 1. Công nghệ sử dụng

- ⚛ React + TypeScript: Xây dựng UI component-based.
- 🎨 Tailwind CSS: Thiết kế UI nhanh và đẹp.
- ⚡ Vite: Công cụ build siêu nhanh.
- 🌍 Axios: Gọi API để xử lý dữ liệu.
- 📦 Redux Toolkit: Quản lý state toàn cục.

---

📌 2. Cách chạy dự án

🔹 A. Cài đặt Node.js & NPM (nếu chưa có)
📥 Tải Node.js (LTS) tại: (node: v22.14.0 || npm: 10.9.2)
🔗 [https://nodejs.org/](https://nodejs.org/)  
🔍 Kiểm tra phiên bản:

```sh
node -v
npm -v
🔹 B. Creat file .env (if not have)
API_BACKEND = "your_api_backend"
🔹 C. Install package and run project
npm i && npm run dev




## Cấu Trúc Dự Án

Dự án được tổ chức theo mô hình Feature-First Architecture kết hợp với Domain-Driven Design (DDD). Cấu trúc này giúp code dễ bảo trì, dễ mở rộng và dễ hiểu.

```

frontend/
├── public/ # Các tệp tĩnh
├── src/ # Mã nguồn
│ ├── assets/ # Tài nguyên (hình ảnh, font...)
│ ├── components/ # Các thành phần dùng chung
│ │ └── ui/ # UI components (Button, Input, Card...)
│ ├── constants/ # Các hằng số
│ ├── contexts/ # React contexts
│ ├── features/ # Các tính năng của ứng dụng
│ │ ├── admin/ # Tính năng quản trị
│ │ ├── auth/ # Tính năng xác thực
│ │ ├── chat/ # Tính năng chat
│ │ ├── disease/ # Tính năng bệnh
│ │ └── users/ # Tính năng người dùng
│ ├── hooks/ # Custom React hooks
│ ├── layouts/ # Các layout trang
│ ├── redux/ # Redux store
│ ├── routes/ # Định nghĩa route
│ ├── types/ # Type definitions
│ └── utils/ # Công cụ tiện ích
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts

```

## Các Quy Ước Coding

### 1. Tổ chức Files

- Mỗi tính năng (`feature`) được đặt trong thư mục riêng với các thành phần sau:
  - `components/`: UI components của tính năng
  - `services/`: Các service gọi API
  - `hooks/`: Custom hooks của tính năng
  - `redux/`: Redux state management
  - `contexts/`: React contexts (nếu cần)
  - `types/`: Type definitions

### 2. Đặt Tên

- **Files**: Sử dụng PascalCase cho component React (ví dụ: `UserCard.tsx`)
- **Biến, hàm**: Sử dụng camelCase (ví dụ: `getUserById`)
- **Types, Interfaces**: Sử dụng PascalCase (ví dụ: `UserProfile`)
- **Constants**: Sử dụng UPPER_SNAKE_CASE (ví dụ: `API_PATHS`)

### 3. Imports

- Thứ tự import:
  1. React và các thư viện third-party
  2. Components
  3. Hooks, services, utilities
  4. Types
  5. Assets, styles

### 4. Component Structure

- Mỗi component nên có một mục đích duy nhất (Single Responsibility)
- Sử dụng Functional Components với hooks
- Sử dụng TypeScript để xác định rõ props

## Best Practices

### API Calls

- Sử dụng `apiClient` cho tất cả các API calls
- Xử lý lỗi một cách nhất quán với `errorUtils`
- Tất cả business logic nên nằm trong services

### State Management

- Sử dụng Redux cho global state
- Sử dụng React Context cho state cục bộ cho một tính năng
- Sử dụng React hooks (useState, useReducer) cho component state

### UI Components

- Sử dụng các UI components từ `components/ui` để đảm bảo tính nhất quán
- Tuân thủ design system (spacing, colors, typography...)

### Type Safety

- Luôn định nghĩa types/interfaces cho props, state và API responses
- Tránh sử dụng `any`

## Scripts

- `npm run dev`: Chạy development server
- `npm run build`: Tạo production build
- `npm run lint`: Kiểm tra lỗi với ESLint
- `npm run format`: Format code với Prettier
- `npm run test`: Chạy tests

## Môi Trường

File `.env` chứa các biến môi trường:

- `VITE_BACKEND_URL`: URL của backend API
- `VITE_APP_ENV`: Môi trường hiện tại (development, staging, production)

## Liên Hệ

Nếu có câu hỏi hoặc gặp vấn đề, vui lòng liên hệ với team lead.
```
