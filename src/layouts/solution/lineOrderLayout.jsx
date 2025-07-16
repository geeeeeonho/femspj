// 📁 src/layouts/solution/lineOrderLayout.jsx

import LineOrderComponent from "../../components/solution/lineOrder";

/*
  레이아웃: 제품별 설비 순서 입력
  설명: 설비 순서 입력 UI를 감싸는 하얀 박스형 레이아웃
*/

function LineOrderLayout() {
  return (
    <div className="bg-white shadow p-4 rounded">
      <LineOrderComponent />
    </div>
  );
}

export default LineOrderLayout;
