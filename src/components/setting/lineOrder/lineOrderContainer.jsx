// src/components/setting/lineOrder/LineOrderContainer.jsx
import React from "react";
import { useLineOrder } from "../../../contexts/lineOrderContext";
import LineOrderDisplay from "./lineOrderDisplay";
import LineOrderEditor from "./lineOrderEditor";

export default function LineOrderContainer() {
  const { loading } = useLineOrder();   // ✅ fetchLineOrder 호출 제거

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="space-y-8">
      <LineOrderDisplay />
      <LineOrderEditor />
    </div>
  );
}
