// React 컴포넌트 파일: root 컴포넌트 기능
/*
  파일: root.jsx
  설명: 모든 페이지를 BasicLayout으로 감싸는 구조로 수정
*/

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import { lazy, Suspense } from "react";
import todoRouter from "./todoRouter";
import BasicLayout from "../layouts/basicLayout";

const Loading = () => <div>Loading....</div>;

const Main = lazy(() => import("../pages/mainPage"));
const About = lazy(() => import("../pages/aboutPage"));
const Auth = lazy(() => import("../pages/authPage"));
const Power = lazy(() => import("../pages/powerPage"));
const RealTime = lazy(() => import("../pages/realtimePage"));

const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <Suspense fallback={<Loading />}>
        <BasicLayout>
          <Auth />
        </BasicLayout>
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <BasicLayout>
          <Main />
        </BasicLayout>
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
        <BasicLayout>
          <Power />
        </BasicLayout>
      </Suspense>
    ),
  },
  {
  path: "/realtime",
  element: (
    <Suspense fallback={<Loading />}>
      <BasicLayout>
        <RealTime />
      </BasicLayout>
    </Suspense>
    ),
  },
  todoRouter(),
]);

export default router;
