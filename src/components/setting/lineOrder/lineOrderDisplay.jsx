// 📁 src/components/setting/lineOrder/LineOrderDisplay.jsx

import React from "react";
import { useLineOrder } from "../../../contexts/lineOrderContext";

export default function LineOrderDisplay() {
  const { lineOrder } = useLineOrder();
  const displayLines = lineOrder.slice(0, 3); // 앞 3개 라인만 가로로 표시

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">현재 라인 및 설비 상태</h2>
      <div className="grid grid-cols-3 gap-4">
        {displayLines.map(({ lineId, productId, equipment, info }, idx) => (
          <div key={lineId} className="border p-3 rounded">
            <h3 className="font-medium mb-2">🏗 {lineId}</h3>
            <p className="text-sm text-blue-600 mb-2">
              제품: {productId || "미정"}
            </p>
            <ul className="list-disc list-inside mb-2">
              {equipment.map((eq, i) => (
                <li key={`${idx}-${i}`} className="flex justify-between">
                  <span>{eq}</span>
                  {info[eq] && (
                    <span className="ml-2 text-xs text-gray-600">{info[eq]}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
