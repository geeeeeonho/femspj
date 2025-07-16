// 📁 src/layouts/solution/workSimulatorLayout.jsx

import WorkSimulatorComponent from "../../components/solution/workSimulator";

/*
  레이아웃: 작업시간 조정 시뮬레이션
  설명: 시뮬레이션 UI를 감싸는 하얀 박스형 레이아웃
*/

function WorkSimulatorLayoutComponent() {
  return (
    <div className="bg-white shadow p-4 rounded">
      <WorkSimulatorComponent />
    </div>
  );
}

export default WorkSimulatorLayoutComponent;
