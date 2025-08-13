// 📁 vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// 개발환경에서 프록시를 통해 백엔드에 연결
// - /auth/*  → 백엔드 인증 라우트
// - /api/*   → 기타 REST API (전력/설정/라인오더 등)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/auth": {
        target: "http://43.202.118.48:5000",
        changeOrigin: true,
        // 필요 시 아래 주석 해제하여 경로 재작성
        // rewrite: (path) => path.replace(/^\/auth/, "/auth"),
      },
      "/api": {
        target: "http://43.202.118.48:5000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
