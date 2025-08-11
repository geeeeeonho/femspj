import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import AuthLayout from "../layouts/authLayout";
import AuthContainer from "../components/auth/authContainer";
import AuthScrollHelperComponent from "../components/auth/authScrollHelper";

export default function AuthPage() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const el = document.getElementById(target);
    if (!el) return;
    const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
    return () => clearTimeout(t);
  }, [location.state]);

  if (loading) return null;
  if (isLoggedIn) return <Navigate to="/" replace />;

  return (
    <div className="h-screen w-screen flex bg-cover bg-center relative"
         style={{ backgroundImage: "url('/images/login-bg.png')" }}>
      <div className="w-4/7 overflow-y-auto max-h-screen pr-2 pt-[70px] scrollbar-none relative z-10">
        <style>{`
          .scrollbar-none::-webkit-scrollbar { display: none; }
          .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="p-8"><AuthLayout /></div>
      </div>
      <div className="w-3/7 flex items-center pl-16">
        <div className="w-full max-w-md ml-auto mr-16"><AuthContainer /></div>
      </div>
      <div className="fixed top-4 left-6 z-50"><AuthScrollHelperComponent /></div>
    </div>
  );
}
