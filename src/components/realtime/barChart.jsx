function BarChartComponent() {
  return (
    <div className="w-full h-[600px] relative">
      <iframe
        src="http://43.202.118.48:3000/d/8d3cb6c6-f16b-4d3d-a72b-38a6c44e2544/new-dashboard?orgId=1&from=now-6h&to=now&viewPanel=2&kiosk"
        width="100%"
        height="100%"
        frameBorder="0"
        title="설비별 전력 소모 바 차트"
      ></iframe>
    </div>
  );
}

export default BarChartComponent;
