import CustomChartUpComponent from "../../components/power/customChartUp";
import CustomChartDownComponent from "../../components/power/customChartDown";
import { useState } from "react";
import { usePowerChart } from "../../contexts/powerChartContext";

function CustomLayoutComponent() {
  const { monthlyData } = usePowerChart();
  const [selectedRange, setSelectedRange] = useState({
    startIndex: 0,
    endIndex: monthlyData.length - 1,
  });

  const visibleData = monthlyData.slice(
    selectedRange.startIndex,
    selectedRange.endIndex + 1
  );

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded shadow">
        <CustomChartUpComponent
          data={monthlyData}
          onRangeChange={setSelectedRange}
        />
        <CustomChartDownComponent visibleData={visibleData} />
      </div>
    </div>
  );
}

export default CustomLayoutComponent;
