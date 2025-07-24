// 📁 src/components/setting/lineOrder/lineOrderContainer.jsx

import { LineOrderProvider } from "../../../contexts/lineOrderContext";
import LineOrderStep1 from "./lineOrderStep1";

/*
  컴포넌트: 설비 순서 컨테이너
  설명: 라인 순서 조정 전체 컴포넌트를 감싸는 최상위 컨테이너
  역할: LineOrderProvider를 감싸고 1단계 컴포넌트부터 렌더링
*/

function LineOrderContainer() {
  return (
    <LineOrderProvider>
      <LineOrderStep1 />
    </LineOrderProvider>
  );
}

export default LineOrderContainer;
