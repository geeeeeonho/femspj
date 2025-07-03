// React 컴포넌트 파일: mainPage 컴포넌트 기능
/*
  파일: mainPage.jsx
  설명: React 컴포넌트 파일: mainPage 컴포넌트 기능을 구현합니다.
*/

import BasicLayout from "../layouts/basicLayout";
import BaseGraphComponent from "../components/graph/baseGraph";

function MainPage() {
  return (
    <BasicLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Main Page</h1>
        <BaseGraphComponent />
      </div>
    </BasicLayout>
  );
}

export default MainPage;