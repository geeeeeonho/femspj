// 📁 src/components/detectionComponent.jsx
import { useEffect, useState } from "react";
import { fetchPeakAlert } from "../../apis/alertApi";

export default function DetectionComponent() {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchPeakAlert()
      .then((data) => {
        if (!alive) return;
        setAlert(data);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <div className="p-4">로딩 중...</div>;

  // 정상 상태
  if (!alert?.isPeak) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded shadow flex items-center gap-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
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

  const recs = Array.isArray(alert?.recommendations) ? alert.recommendations : [];
  const hasRecs = recs.length > 0;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded shadow">
      <div className="flex items-start gap-3">
        <svg className="w-8 h-8 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"/>
        </svg>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-red-600">전력 피크 경보</h2>
          {alert.time && (
            <div className="text-xs text-red-700/80 mt-0.5">
              발생 시각: <span className="font-semibold">{alert.time}</span>
            </div>
          )}

          <div className="mt-3 text-sm text-red-800 leading-relaxed">
            <p>곧 전력 피크 상황이 예상됩니다.</p>
            <p className="mt-1">다음 설비를 점검하거나 일시중단 하세요:</p>

            {/* 여러 개를 칩 형태로 나열 */}
            <div className="mt-2 flex flex-wrap gap-2">
              {hasRecs ? (
                recs.map((r) => {
                  const name = r?.name || r?.facId || "(설비)";
                  return (
                    <span
                      key={r?.facId || name}
                      className="inline-flex items-center rounded-full border border-red-300 bg-white px-3 py-1 text-sm text-red-700 shadow-sm"
                      title={name}
                    >
                      <span className="font-medium">{name}</span>
                    </span>
                  );
                })
              ) : (
                <span className="text-red-700/90">(추천 설비 없음)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
