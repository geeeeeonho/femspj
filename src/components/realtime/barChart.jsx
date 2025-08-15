// 📁 src/components/realtime/barChart.jsx

function BarChartComponent() {
  const grafanaUrl =
    "https://api.sensor-tive.com/grafana/d-solo/6e478a61-0c17-4187-a284-4623b98dc829/6e478a61-0c17-4187-a284-4623b98dc829?orgId=1&from=now-6h&to=now&panelId=1&kiosk";

  return (
    <div style={{ height: '100vh' }}>
      <iframe
        src={grafanaUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="Realtime Power Chart"
      />
    </div>
  );
}

export default BarChartComponent;
