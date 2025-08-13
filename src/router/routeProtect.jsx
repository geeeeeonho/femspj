// 📁 src/components/common/routeProtect.jsx  ← 파일명 소문자 권장
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext"; // ← 경로 수정

function RouteProtect({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-600" role="status" aria-busy="true">
        🔐 로그인 상태 확인 중...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location }} // ← 원래 목적지 기억
      />
    );
  }

  return children;
}

export default RouteProtect;
