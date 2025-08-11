// 📁 src/index.jsx  또는 src/main.jsx (프로젝트 엔트리 한 군데만!)
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router/root';

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
);
