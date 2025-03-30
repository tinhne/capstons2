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


#Model Folder-By-Features
In project
frontend/
──src/
  │── features/               Mỗi tính năng có thư mục riêng
  │   │── auth/               Tính năng xác thực người dùng
  │   │   │── components/
  │   │   │   │── LoginForm.tsx
  │   │   │   │── RegisterForm.tsx
  │   │   │── services/
  │   │   │   │── authService.ts
  │   │   │── redux/
  │   │   │   │── authSlice.ts
  │   │   │── types.ts         Định nghĩa kiểu dữ liệu cho Auth
  │   │   │── AuthPage.tsx
  │   │── uers/             
  │   │   │── components/
  │   │   │── services/
  │   │   │   │── chatService.ts
  │   │   │── redux/
  │   │   │   │── UserSlice.ts
  │   │   │── types.ts
  │   │── chat/               Tính năng chatbot / nhắn tin
  │   │   │── components/
  │   │   │   │── ChatBox.tsx
  │   │   │   │── MessageList.tsx
  │   │   │── services/
  │   │   │   │── chatService.ts
  │   │   │── redux/
  │   │   │   │── chatSlice.ts
  │   │   │── types.ts
  │   │   │── ChatPage.tsx
  │── layouts/                 Layouts dùng chung
  │   │── MainLayout.tsx
  │   │── AuthLayout.tsx
  │── routes/                  Quản lý định tuyến
  │   │── routes.tsx
  │── hooks/                   Custom hooks dùng chung
  │   │── useAuth.ts
  │   │── useFetch.ts
  │── contexts/                Context API
  │   │── AuthContext.tsx
  │── redux/                   Redux Store
  │   │── store.ts
  │── utils/                   Helpers, format data, API clients
  │   │── formatDate.ts
  │   │── apiClient.ts
  │── App.tsx
  │── main.tsx
  │── index.css



```
