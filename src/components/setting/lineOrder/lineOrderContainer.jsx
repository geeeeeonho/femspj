// 📁 src/components/setting/lineOrder/LineOrderContainer.jsx

import React, { useEffect } from "react";
import { useLineOrder } from "../../../contexts/lineOrderContext";
import LineOrderDisplay from "./LineOrderDisplay";
import LineOrderEditor from "./LineOrderEditor";

export default function LineOrderContainer() {
  const { fetchLineOrder, loading } = useLineOrder();

  useEffect(() => {
    fetchLineOrder();
  }, [fetchLineOrder]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="space-y-8">
      <LineOrderDisplay />
      <LineOrderEditor />
    </div>
  );
}
