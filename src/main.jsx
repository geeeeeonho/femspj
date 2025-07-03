// React 진입점: 앱 초기화
/*
  설명:
  - RouterProvider를 AuthProvider로 감싸서 로그인 상태를 전역에서 접근 가능하게 합니다.
*/

import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router/root'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/authContext'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
