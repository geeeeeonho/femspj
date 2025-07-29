// 📁 src/components/common/RouteProtect.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

function RouteProtect({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-600">
        🔐 로그인 상태 확인 중...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default RouteProtect;
