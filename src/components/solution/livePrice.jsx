import { useEffect, useState } from "react";
import { fetchLivePrice } from "../../apis/livePriceApi";

function LivePriceComponent() {
  const [priceInfo, setPriceInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLivePrice()
      .then(setPriceInfo)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>요금 불러오는 중...</div>;

  // priceInfo가 있고 priceInfo.price가 undefined/null이 아닐 때만 출력
  const displayPrice =
    priceInfo && priceInfo.price !== undefined && priceInfo.price !== null
      ? `${priceInfo.price.toLocaleString()} ${priceInfo.unit || ""}`
      : "-";

  const displayUpdatedAt =
    priceInfo && priceInfo.updatedAt
      ? `${priceInfo.updatedAt} 기준`
      : "";

  return (
    <>
      <span className="text-3xl font-bold text-blue-600">
        {displayPrice}
      </span>
      <span className="text-xs text-gray-400 mt-1">
        {displayUpdatedAt}
      </span>
    </>
  );
}

export default LivePriceComponent;
