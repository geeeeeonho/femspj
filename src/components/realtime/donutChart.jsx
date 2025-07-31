// 📁 src/components/realtime/donutChart.jsx

function DonutChartComponent() {
  const grafanaUrl =
    "https://api.sensor-tive.com/grafana/d/8d3cb6c6-f16b-4d3d-a72b-38a6c44e2544/new-dashboard?orgId=1&from=now-6h&to=now&timezone=browser&refresh=5s&viewPanel=panel-1";

  return (
    <div style={{ height: '100vh' }}>
      <iframe
        src={grafanaUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="Realtime Donut Chart"
      />
    </div>
  );
}

export default DonutChartComponent;
