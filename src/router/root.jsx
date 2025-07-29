// 📁 src/router/root.jsx

import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import BasicLayout from "../layouts/basicLayout";
import RouteProtect from "./routeProtect";


const Loading = () => <div>Loading....</div>;

const Main = lazy(() => import("../pages/mainPage"));
const About = lazy(() => import("../pages/aboutPage"));
const Auth = lazy(() => import("../pages/authPage"));
const Power = lazy(() => import("../pages/powerPage"));
const RealTime = lazy(() => import("../pages/realtimePage"));
const Solution = lazy(() => import("../pages/solutionPage"));
const Setting = lazy(() => import("../pages/settingPage"));

const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <Suspense fallback={<Loading />}>
        <Auth />
      </Suspense>
    ),
  },
  {
    path: "/",
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
    path: "/about",
    element: (
      <Suspense fallback={<Loading />}>
        <BasicLayout>
          <About />
        </BasicLayout>
      </Suspense>
    ),
  },
  {
    path: "/power",
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
    path: "/realtime",
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
    path: "/solution",
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
    path: "/setting",
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
]);

export default router;
