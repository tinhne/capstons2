import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Địa chỉ backend của bạn
        changeOrigin: true, // Đảm bảo rằng CORS được xử lý đúng
        secure: false, // Nếu backend sử dụng HTTP không có HTTPS
      },
    },
  },
});
