// React 컴포넌트 파일: main 컴포넌트 기능
/*
  파일: main.jsx
  설명: React 컴포넌트 파일: main 컴포넌트 기능을 구현합니다.
*/

import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router/root'
import { RouterProvider } from 'react-router'





createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
