// 📁 src/components/realtime/barChart.jsx

function BarChartComponent() {
  return (
    <div className="w-full h-[600px] relative overflow-hidden rounded-lg shadow">
      <iframe
  src="http://43.202.118.48:3000/d/8d3cb6c6-f16b-4d3d-a72b-38a6c44e2544/new-dashboard?orgId=1&from=now-6h&to=now&timezone=browser&viewPanel=panel-2"
  width="100%"
  height="600"
  frameBorder="0"
/>
    </div>
  );
}

export default BarChartComponent;
