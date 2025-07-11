import { useEffect, useState } from "react";
import { fetchPeakAlert } from "../../apis/alertApi";

function DetectionComponent() {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때 알람 정보 fetch
    fetchPeakAlert()
      .then(data => setAlert(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">로딩 중...</div>;

  // 알람이 감지되지 않은 경우
  if (!alert?.isPeak) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded shadow flex items-center gap-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <h2 className="text-lg font-bold text-green-600">정상 상태</h2>
          <p className="text-sm text-green-700 mt-1">현재 이상 신호가 없습니다.</p>
        </div>
      </div>
    );
  }

  // 알람(이상 피크) 감지 시
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded shadow flex items-center gap-4">
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"/>
      </svg>
      <div>
        <h2 className="text-lg font-bold text-red-600">이상 감지</h2>
        <p className="text-sm text-red-700 mt-1">
          전력 피크가 감지되었습니다.<br />
          발생 시간: <span className="font-semibold">{alert.time}</span>
        </p>
      </div>
    </div>
  );
}

export default DetectionComponent;
