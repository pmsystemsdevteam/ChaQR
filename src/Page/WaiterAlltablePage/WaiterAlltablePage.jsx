// WaiterAlltablePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./WaiterAlltablePage.scss";

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

// ISO vaxtı olduğu kimi göstər (UTC/lokal çevirmə etmir)
function formatTimeFromISO(iso) {
  if (typeof iso !== "string") return "—";
  // 2025-09-01T06:54:27.007374Z  -> "06:54"
  const m = iso.match(/T(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : "—";
}


export default function WaiterAlltablePage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch("http://172.20.5.167:8001/api/tables/");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const normalized = (Array.isArray(data) ? data : []).map((t) => ({
  id: t.id ?? `${t.table_num ?? t.number ?? Math.random()}`,
  number: t.table_num ?? t.number ?? "—",
  status: t.status ?? "sendOrder",
  orders_count: t.orders_count ?? t.ordersCount ?? t.order_count ?? t.orderCount ?? 0,
  time: t.created_at ?? t.createdAt ?? t.time ?? t.updated_at ?? t.updatedAt ?? null, // ⬅️
}));


        if (!cancelled) setTables(normalized);
      } catch (e) {
        if (!cancelled) setErr(String(e.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const cards = useMemo(() => {
    return (
      tables.length
        ? tables
        : Array.from({ length: 16 }, (_, i) => ({
            id: `sk-${i}`,
            number: 12,
            status:
              i === 0
                ? "sendOrder"
                : i === 1
                ? "waitingBill"
                : i === 2
                ? "makeFood"
                : i === 3
                ? "deliveredFood"
                : "waitingWaiter",
            orders_count: 5,
            // skeleton üçün nümunə ISO
            time: "2025-09-01T06:54:27.007374Z",
            __skeleton: tables.length === 0,
          }))
    ).slice(0, 16);
  }, [tables]);

  return (
    <div id="waiterAllTablePage">
      <h1>Masa məlumatları</h1>

      {err && (
        <div className="error">
          Məlumat alına bilmədi: <b>{err}</b>
        </div>
      )}

      <div className="allTableBox">
        {cards.map((t, idx) => {
          const colorKey = STATUS_COLORS[t.status] ?? "b";
          const statusClass = `status ${colorKey}`;
          const isSkeleton = !!t.__skeleton && loading;

          return (
            <div
              key={t.id ?? idx}
              className={`table ${statusClass} ${isSkeleton ? "skeleton" : ""}`}
            >
              <div className="up">
                <p>{`Masa № ${t.number}`}</p>
                <span>{formatTimeFromISO(t.time)}</span>
              </div>

              <div className="down">
                <span>
                  {STATUS_LABELS[t.status] ??
                    `${t.orders_count} ədəd sifariş verildi`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
