import { useEffect, useState } from "react";
import { fetchPeakAlert } from "../../apis/alertApi";

function DetectionComponent() {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeakAlert({ topN: 4 }) // 필요시 추천 개수 조절
      .then((data) => setAlert(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">로딩 중...</div>;

  // 알람이 감지되지 않은 경우
  if (!alert?.isPeak) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded shadow flex items-center gap-4">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M8 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <h2 className="text-lg font-bold text-green-600">정상 상태</h2>
          <p className="text-sm text-green-700 mt-1">
            현재 이상 신호가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  // 알람(이상 피크) 감지 시
  const recs = Array.isArray(alert?.recommendations)
    ? alert.recommendations
    : [];

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded shadow">
      <div className="flex items-start gap-4">
        <svg
          className="w-8 h-8 text-red-500 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
          />
        </svg>

        <div className="flex-1">
          <h2 className="text-lg font-bold text-red-600">
            전력 피크 발생 가능성이 높습니다.
          </h2>
          <p className="text-sm text-red-700 mt-1">
            전력 피크 가능성이 감지되었습니다.
            <br />
            예측 시간:{" "}
            <span className="font-semibold">{alert.time ?? "-"}</span>
          </p>

          <div className="mt-3">
            <p className="text-sm text-red-800">
              다음 설비들을 끄거나 점검을 추천합니다.
            </p>

            {recs.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {recs.map((r, idx) => (
                  <span
                    key={`${r.facId ?? idx}-${idx}`}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs border border-red-200"
                  >
                    <strong>{r.facId}</strong>
                    {r.lineId && (
                      <span className="opacity-60">· {r.lineId}</span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-red-700 mt-2 opacity-80">
                추천 설비 목록을 불러오지 못했습니다. 실시간 페이지에서 상세 상태를
                확인하세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetectionComponent;
