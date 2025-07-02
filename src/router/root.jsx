// React 컴포넌트 파일: root 컴포넌트 기능
/*
  파일: root.jsx
  설명: React 컴포넌트 파일: root 컴포넌트 기능을 구현합니다.
*/

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";

import { lazy, Suspense } from "react";
import todoRouter from "./todoRouter";

const Loading = () => <div>Loading....</div>

const Main = lazy(() => import("../pages/mainPage"))
const About = lazy(() => import("../pages/aboutPage"))


const router = createBrowserRouter([
{
    path: "/",
    element: <Suspense fallback={<Loading/>}><Main/></Suspense>,

},
{
    path: "/about",
    element: <Suspense fallback={<Loading/>}><About/></Suspense>,
},
todoRouter()
]);

export default router;


