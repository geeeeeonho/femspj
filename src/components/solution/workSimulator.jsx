import { useEffect, useState } from "react";
import { fetchWorkSimulData } from "../../apis/workSimulApi";

function WorkSimulatorComponent() {
  const [workingTimes, setWorkingTimes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchWorkSimulData();
      setWorkingTimes(data);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-4">
      {/* ✅ 상단 설명 문구 (분리 강조) */}
      <div className="bg-gray-100 p-4 rounded text-base text-gray-800 font-medium shadow-sm">
        작업시간 조정을 통해 생산성 및 전력 효율성을 향상 시킬 수 있습니다.
      </div>

      {/* ✅ 라인별 작업시간 목록 */}
      <ul className="space-y-2">
        {workingTimes.map((item, idx) => (
          <li key={idx} className="text-base text-gray-900">
            <span className="font-semibold">{item.line}</span> : {item.start} ~ {item.end}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WorkSimulatorComponent;
