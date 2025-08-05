// 📁 src/components/setting/lineOrder/LineOrderDisplay.jsx

import React from "react";
import { useLineOrder } from "../../../contexts/lineOrderContext";

export default function LineOrderDisplay() {
  const { lineOrder } = useLineOrder();

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">현재 라인 및 설비 상태</h2>
      {lineOrder.map(({ lineId, equipment, info }, idx) => (
        <div key={lineId} className="mb-6">
          <h3 className="font-medium">🏗 {lineId}</h3>
          <ul className="list-disc list-inside ml-4 mb-2">
            {equipment.map((eq, i) => (
              <li key={`${idx}-${i}`} className="flex justify-between">
                <span>{eq}</span>
                {info && info[eq] && (
                  <span className="ml-4 text-sm text-gray-600">{info[eq]}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
