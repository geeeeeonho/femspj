// 📁 src/index.jsx
import { createRoot } from 'react-dom/client';
import './index.css';
import router from './router/root';
import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from "./contexts/authContext";
import { PowerChartProvider } from "./contexts/powerChartContext";
import { AlertProvider } from "./contexts/alertContext";
import { PowerTypeProvider } from "./contexts/powerTypeContext";

// ↓ 추가: LineOrderProvider import
import { LineOrderProvider } from "./contexts/lineOrderContext";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <PowerChartProvider>
      <AlertProvider>
        <PowerTypeProvider>
           <LineOrderProvider>
            <RouterProvider router={router} />
           </LineOrderProvider>
        </PowerTypeProvider>
      </AlertProvider>
    </PowerChartProvider>
  </AuthProvider>
);
