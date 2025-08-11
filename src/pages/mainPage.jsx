// 파일: src/pages/main.jsx
// 홈 메인 페이지 (로그인 후 접속)

import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "../layouts/mainLayout";

function MainPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  return <MainLayout usert={user?.name ?? "고객"} />;
}

export default MainPage;
