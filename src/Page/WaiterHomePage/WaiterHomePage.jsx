import React, { useEffect, useMemo, useState } from "react";
import "./WaiterHomePage.scss";
import ChaqrLoading from "../../Components/Loading/Loading";

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

function getUpdatedAt(b) {
  if (b?.updated_at) return new Date(b.updated_at);
  if (b?.created_at) return new Date(b.created_at);
  return new Date(0);
}

function formatTime(d) {
  if (!d || isNaN(d.getTime?.())) return "—";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function WaiterHomePage() {
  const [baskets, setBaskets] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        // ✅ Baskets (sifarişlər)
        const basketRes = await fetch(`${API_BASE_URL}/api/baskets/`);
        const basketJson = await basketRes.json();
        
        // ✅ Tables (ofisiant çağırışı)
        const tableRes = await fetch(`${API_BASE_URL}/api/tables/`);
        const tableJson = await tableRes.json();

        if (!isMounted) return;
        
        setBaskets(Array.isArray(basketJson) ? basketJson : []);
        setTables(Array.isArray(tableJson) ? tableJson : []);
      } catch (e) {
        console.error("Fetch error:", e);
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

  // ✅ Basket-ləri emal et (sifarişlər)
  const latestPerTable = useMemo(() => {
    const sorted = [...baskets].sort((a, b) => getUpdatedAt(a) - getUpdatedAt(b));
    const map = new Map();
    
    for (const b of sorted) {
      const key = b?.table?.id ?? b?.table?.table_num;
      if (key != null) map.set(key, b);
    }

    return Array.from(map.values())
      .filter((b) => computeStatusKey(b) !== "empty")
      .sort((a, b) => getUpdatedAt(b) - getUpdatedAt(a));
  }, [baskets]);

  // ✅ Table-ləri filter et (ofisiant çağırışı)
  const waitingTables = useMemo(() => {
    return tables.filter((t) => t.status === "waitingWaiter");
  }, [tables]);

  if (loading) {
    return (
      <div id="waiterHomePage" style={{ overflow: "hidden" }}>
        <h2 className="title">Bildirişlər</h2>
        <ChaqrLoading />
      </div>
    );
  }

  return (
    <div id="waiterHomePage">
      <h2 className="title">Bildirişlər</h2>

      {/* ✅ Ofisiant Çağırışları */}
      {waitingTables.length > 0 && (
        <div className="section">
          <h3 className="title">Ofisiant Çağırışları</h3>
          <div className="allPage">
            {waitingTables.map((table) => (
              <div className="statusBox" key={`table-${table.id}`}>
                <div className="up">
                  <p>Masa nömrəsi : №{table.table_num}</p>
                  <span>Çağırış vaxtı: {formatTime(new Date(table.created_at))}</span>
                </div>
                <div className="down">
                  <span>Stul sayı: {table.chair_number}</span>
                  <div className="status b" data-status="Ofisiant gözləyir">
                    Ofisiant gözləyir
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Sifarişlər */}
      {latestPerTable.length > 0 && (
        <div className="section">
          <h3 className="title">Aktiv Sifarişlər</h3>
          <div className="allPage">
            {latestPerTable.map((b) => {
              const tableNum = b?.table?.table_num ?? "-";
              const orderNo = b?.order_number ?? "-";
              const updatedAt = getUpdatedAt(b);
              const statusKey = computeStatusKey(b);
              const statusText = STATUS_LABELS[statusKey] || statusKey;
              const colorClass = STATUS_COLORS[statusKey] || "gray";

              return (
                <div className="statusBox" key={`basket-${b.id}`}>
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
          </div>
        </div>
      )}

      {/* ✅ Heç bir bildiriş yoxdursa */}
      {waitingTables.length === 0 && latestPerTable.length === 0 && (
        <div className="loading">Bildiriş yoxdur</div>
      )}
    </div>
  );
}

export default WaiterHomePage;
