// 📁 src/index.jsx
// React 진입점: 앱 초기화
/*
  설명:
  - 모든 페이지를 AuthProvider, PowerChartProvider, AlertProvider, PowerTypeProvider 등으로 감싸 전역 상태 관리 가능하게 구성합니다.
*/

import { createRoot } from 'react-dom/client';
import './index.css';
import router from './router/root';
import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from "./contexts/authContext";
import { PowerChartProvider } from "./contexts/PowerChartContext";
import { AlertProvider } from "./contexts/alertContext";
import { PowerTypeProvider } from "./contexts/powerTypeContext"; // ✅ 새로 추가된 전력유형 Context

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <PowerChartProvider>
      <AlertProvider>
        <PowerTypeProvider> {/* ✅ 전력 유형 Context 추가 */}
          <RouterProvider router={router} />
        </PowerTypeProvider>
      </AlertProvider>
    </PowerChartProvider>
  </AuthProvider>
);
