// // 📁 src/router/routeProtect.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../contexts/authContext";

// // 라우트 보호 컴포넌트
// // - children 사용/Outlet 둘 다 지원
// export default function RouteProtect({ children }) {
//   const { isLoggedIn, loading } = useAuth();

//   if (loading) {
//     // 필요하면 스피너/로딩 UI
//     return null;
//   }

//   if (!isLoggedIn) {
//     return <Navigate to="/auth" replace />;
//   }

//   // children이 있으면 children, 없으면 Outlet
//   return children ?? <Outlet />;
// }


// 📁 src/router/routeProtect.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

/**
 * 보호 라우트
 * - 기본: loading으로 화면을 막지 않음(권장)
 * - blockOnLoading=true 전달 시 로딩 동안 차단 가능
 * - 미로그인 시 /auth로 보내되, 돌아올 경로(state.from) 유지
 */
export default function RouteProtect({ children, blockOnLoading = false, loadingFallback = null }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  // 옵션: 로딩 중 차단하고 싶을 때만
  if (blockOnLoading && loading) {
    return loadingFallback ?? null; // 필요하면 스피너 컴포넌트 전달
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
}
