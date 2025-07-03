// React 레이아웃 컴포넌트: 로그인/회원가입 페이지용 배경 레이아웃
/*
  설명:
  - 배경 이미지 포함, 중앙 정렬
  - children에 AuthContainer를 삽입
*/

function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }} // public 폴더에 이미지 필요
    >
      {children}
    </div>
  );
}

export default AuthLayout;
