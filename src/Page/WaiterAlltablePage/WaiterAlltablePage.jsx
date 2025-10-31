import React, { useEffect, useMemo, useState } from "react";
import "./WaiterAlltablePage.scss";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS = {
  waitingWaiter: "Ofisiant gözləyir",
  waitingBill: "Hesab gözləyir",
  sendOrder: "Sifariş etdi",
  sendKitchen: "Hazırlanır",
  makeFood: "Hazırlanır",
  deliveredFood: "Hazırdı",
  empty: "Boşdur",
};

const STATUS_COLORS = {
  waitingWaiter: "b",
  waitingBill: "c",
  sendOrder: "f",
  sendKitchen: "d",
  makeFood: "d",
  deliveredFood: "a",
};

function formatTimeFromISO(iso) {
  if (typeof iso !== "string") return "—";
  const m = iso.match(/T(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : "—";
}

function WaiterAlltablePage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/tables/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const normalized = (Array.isArray(data) ? data : []).map((t) => ({
          id: t.id,
          number: t.table_num ?? "—",
          status: t.status ?? "sendOrder",
          time: t.time ?? t.created_at ?? null,
        }));

        if (!cancelled) setTables(normalized);
      } catch (e) {
        if (!cancelled) setErr(String(e.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(() => {
    return tables.length
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
          time: "2025-09-01T06:54:27.007374Z",
          __skeleton: tables.length === 0,
        }));
  }, [tables]);

  const handleTableClick = (tableId) => {
    localStorage.setItem("selectedTableId", tableId);
    navigate("/waiter/waiterMenu");
  };

  return (
    <div id="waiterAllTablePage">
      <h1>Masa məlumatları</h1>

      {err && (
        <div className="error">
          Məlumat alına bilmədi: <b>{err}</b>
        </div>
      )}

      <div className="allTableBox">
        {!loading && tables.length === 0 ? (
          <div className="noData">Masa yoxdur</div>
        ) : (
          cards.map((t, idx) => {
            const colorKey = STATUS_COLORS[t.status] ?? "b";
            const statusClass = `status ${colorKey}`;
            const isSkeleton = !!t.__skeleton && loading;

            return (
              <div
                key={t.id ?? idx}
                className={`table ${statusClass} ${isSkeleton ? "skeleton" : ""}`}
                onClick={() => !isSkeleton && handleTableClick(t.id)}
                style={{ cursor: isSkeleton ? "default" : "pointer" }}
              >
                <div className="up">
                  <p>{`Masa № ${t.number}`}</p>
                  <span>{formatTimeFromISO(t.time)}</span>
                </div>

                <div className="down">
                  <span>{STATUS_LABELS[t.status] ?? t.status}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default WaiterAlltablePage;
