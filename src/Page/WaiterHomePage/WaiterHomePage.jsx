import React, { useEffect, useMemo, useState } from "react";
import "./WaiterHomePage.scss";

// --- Status xəritələri ---
const STATUS_LABELS = {
  waitingWaiter: "Ofisiant gözləyir",
  waitingBill: "Hesab gözləyir",
  sendOrder: "Sifariş etdi",
  sendKitchen: "Hazırlanır",
  makeFood: "Hazırlanır",
  deliveredFood: "Hazırdı",
};

const STATUS_COLORS = {
  waitingWaiter: "b",
  waitingBill: "c",
  sendOrder: "f",
  sendKitchen: "d",
  makeFood: "d",
  deliveredFood: "a",
};

// food_status içində ən son TRUE olan addımı tap; yoxdursa table.status götür
function computeStatusKey(basket) {
  const orderSteps = ["sendOrder", "sendKitchen", "makeFood", "deliveredFood"];
  let latest = null;

  if (Array.isArray(basket?.food_status)) {
    basket.food_status.forEach((entry) => {
      for (const key of orderSteps) {
        if (entry[key]) latest = key;
      }
    });
  }
  return latest || basket?.table?.status || "empty";
}

// updated üçün tarix seçimi
function getUpdatedAt(b) {
  // API-də varsa updated_at prioritetdir
  if (b?.updated_at) return new Date(b.updated_at);
  // yoxdursa created_at
  if (b?.created_at) return new Date(b.created_at);
  return new Date(0);
}

function formatTime(d) {
  if (!d || isNaN(d.getTime?.())) return "—";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function WaiterHomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // API-dən gətir + polling
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch("https://efficiently-leads-table-august.trycloudflare.com/api/baskets/");
        const json = await res.json();
        if (!isMounted) return;
        setData(Array.isArray(json) ? json : []);
      } catch (e) {
        console.error("Baskets fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    const id = setInterval(load, 5000);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, []);

  // Hər masa üçün ən SON basket (updated-a görə), empty olanları gizlət
  const latestPerTable = useMemo(() => {
    // updated-ə görə artan sort, sonra map ilə sonuncunu saxlamaq üçün
    const sorted = [...data].sort((a, b) => getUpdatedAt(a) - getUpdatedAt(b));

    const map = new Map(); // key = table.id (fallback: table_num)
    for (const b of sorted) {
      const key = b?.table?.id ?? b?.table?.table_num;
      if (key != null) map.set(key, b); // eyni masadan yalnız ən son qalsın
    }

    // map dəyərlərini çək, EMPTY olanları at, sonra updated-desc sıralayıb qaytar
    return Array.from(map.values())
      .filter((b) => computeStatusKey(b) !== "empty") // 🔥 boş olanlar görünməsin
      .sort((a, b) => getUpdatedAt(b) - getUpdatedAt(a)); // 🔥 ən yenisi önə
  }, [data]);

  if (loading) {
    return (
      <div id="waiterHomePage">
        <h2 className="title">Sifariş məlumatları</h2>
        <div className="loading">Yüklənir...</div>
      </div>
    );
  }

  return (
    <div id="waiterHomePage">
      <h2 className="title">Sifariş məlumatları</h2>
      <div className="allPage">
        {latestPerTable.map((b) => {
          const tableNum = b?.table?.table_num ?? "-";
          const orderNo = b?.order_number ?? "-";
          const updatedAt = getUpdatedAt(b);
          const statusKey = computeStatusKey(b);
          const statusText = STATUS_LABELS[statusKey] || statusKey;
          const colorClass = STATUS_COLORS[statusKey] || "gray";

          return (
            <div className="statusBox" key={b.id}>
              <div className="up">
                <p>Masa nömrəsi : №{tableNum}</p>
                <span>Sifariş verilmə vaxtı: {formatTime(updatedAt)}</span>
              </div>
              <div className="down">
                <span>Sifariş nömrəsi : {orderNo}</span>
                <div
                  className={`status ${colorClass}`}
                  data-status={statusText}
                  title={statusKey}
                >
                  {statusText}
                </div>
              </div>
            </div>
          );
        })}

        {latestPerTable.length === 0 && (
          <div className="loading">Aktiv sifariş yoxdur.</div>
        )}
      </div>
    </div>
  );
}
