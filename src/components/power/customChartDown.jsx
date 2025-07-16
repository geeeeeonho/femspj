function CustomChartDownComponent({ visibleData }) {
  const sorted = [...visibleData].sort((a, b) => b.power - a.power);
  const top7 = sorted.slice(0, 7);

  return (
    <div className="mt-4 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
      <h3 className="text-sm font-semibold mb-2">🔥 선택 구간 전력 소비 TOP 7</h3>
      <table className="w-full text-sm border border-gray-300 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">순위</th>
            <th className="border px-2 py-1">날짜</th>
            <th className="border px-2 py-1">요일</th>
            <th className="border px-2 py-1">소비량</th>
          </tr>
        </thead>
        <tbody>
          {top7.map((item, idx) => (
            <tr
              key={item.date}
              className={`border-t ${idx < 3 ? "bg-red-100 font-bold" : "bg-orange-100"}`}
            >
              <td className="border px-2 py-1">{idx + 1}위</td>
              <td className="border px-2 py-1">{item.date}</td>
              <td className="border px-2 py-1">{item.weekday}</td>
              <td className="border px-2 py-1">{item.power} kWh</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomChartDownComponent;
