// React 컴포넌트 파일: totalPowerComponent
/*
  설명:
  - 전체 전력 소모량을 표 형태로 보여주는 샘플 컴포넌트
  - 추후 MySQL에서 가져올 수 있도록 주석 처리된 fetch 방식 포함
*/

import { useEffect, useState } from "react";

function TotalPowerComponent() {
  const [data, setData] = useState([]);

  // 샘플 데이터 (단위: kWh)
  useEffect(() => {
    const sampleData = [
      { date: "2025-07-01", usage: 3200 },
      { date: "2025-07-02", usage: 3100 },
      { date: "2025-07-03", usage: 3500 },
    ];
    setData(sampleData);

    /*
    // 만약 실제 서버(MySQL + Express API 등)에서 가져온다면 아래와 같은 코드 사용
    fetch("http://localhost:3001/api/power/total")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("데이터 로드 오류:", err));
    */
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">📊 전체 전력 소모량</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">날짜</th>
            <th className="border p-2">전력 사용량 (kWh)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{entry.date}</td>
              <td className="border p-2">{entry.usage.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TotalPowerComponent;
