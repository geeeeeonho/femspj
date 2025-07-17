// ✅ 1단계: 라인 전체 관리 컴포넌트 (LineOrderStep1)
// 📁 src/components/solution/lineOrder/lineOrderStep1.jsx

import { useLineOrder } from "../../../contexts/lineOrderContext";
import LineOrderStep2 from "./lineOrderStep2";

function LineOrderStep1() {
  const { lineOrder, setLineOrder } = useLineOrder();

  if (!lineOrder) return <div>⏳ 데이터 로딩 중...</div>;
  if (lineOrder.length === 0) return <div>⚠️ 불러온 설비 라인이 없습니다.</div>;

  return (
    <div className="space-y-6">
      {lineOrder.map((line, index) => (
        <LineOrderStep2
          key={line.lineId || index}
          lineData={line}
          lineIndex={index}
          setLineOrder={setLineOrder}
          allLineOrder={lineOrder}
        />
      ))}
    </div>
  );
}

export default LineOrderStep1;