import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function RequireAuth() {
  const { isLoggedIn, loading } = useAuth();
  const loc = useLocation();

  if (loading) return null; // 스켈레톤/스피너로 대체 가능
  return isLoggedIn ? <Outlet /> : <Navigate to="/auth" replace state={{ from: loc }} />;
}
