// 📁 src/router/root.jsx
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import BasicLayout from '../layouts/basicLayout';
import RouteProtect from './routeProtect';

// Providers
import { AuthProvider } from '../contexts/authContext';
import { PowerChartProvider } from '../contexts/powerChartContext';
import { AlertProvider } from '../contexts/alertContext';
import { PowerTypeProvider } from '../contexts/powerTypeContext';
import { LineOrderProvider } from '../contexts/lineOrderContext';

// Pages (파일명/대소문자 정확히!)
const Loading = () => <div>Loading....</div>;
const Main      = lazy(() => import('../pages/mainPage'));
const About     = lazy(() => import('../pages/aboutPage'));
const Auth      = lazy(() => import('../pages/authPage'));
const Power     = lazy(() => import('../pages/powerPage'));
const RealTime  = lazy(() => import('../pages/realtimePage'));
const Solution  = lazy(() => import('../pages/solutionPage'));
const Setting   = lazy(() => import('../pages/settingPage'));

function ProvidersWrapper() {
  return (
    <AuthProvider>
      <PowerChartProvider>
        <AlertProvider>
          <PowerTypeProvider>
            <LineOrderProvider>
              <Outlet />
            </LineOrderProvider>
          </PowerTypeProvider>
        </AlertProvider>
      </PowerChartProvider>
    </AuthProvider>
  );
}

export default createBrowserRouter([
  {
    element: <ProvidersWrapper />, // ✅ Router 안쪽에서 Provider 제공
    children: [
      {
        path: '/auth',
        element: (
          <Suspense fallback={<Loading />}>
            <Auth />
          </Suspense>
        ),
      },
      {
        path: '/',
        element: (
          <Suspense fallback={<Loading />}>
            <RouteProtect>
              <BasicLayout>
                <Main />
              </BasicLayout>
            </RouteProtect>
          </Suspense>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense fallback={<Loading />}>
            <BasicLayout>
              <About />
            </BasicLayout>
          </Suspense>
        ),
      },
      {
        path: '/power',
        element: (
          <Suspense fallback={<Loading />}>
            <RouteProtect>
              <BasicLayout>
                <Power />
              </BasicLayout>
            </RouteProtect>
          </Suspense>
        ),
      },
      {
        path: '/realtime',
        element: (
          <Suspense fallback={<Loading />}>
            <RouteProtect>
              <BasicLayout>
                <RealTime />
              </BasicLayout>
            </RouteProtect>
          </Suspense>
        ),
      },
      {
        path: '/solution',
        element: (
          <Suspense fallback={<Loading />}>
            <RouteProtect>
              <BasicLayout>
                <Solution />
              </BasicLayout>
            </RouteProtect>
          </Suspense>
        ),
      },
      {
        path: '/setting',
        element: (
          <Suspense fallback={<Loading />}>
            <RouteProtect>
              <BasicLayout>
                <Setting />
              </BasicLayout>
            </RouteProtect>
          </Suspense>
        ),
      },
    ],
  },
]);
