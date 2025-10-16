import React, { useEffect, useState } from "react";
import "./MyOrderPage1.scss";
import Left from "../../Image/OrderLeft.png";
import Right from "../../Image/OrderRight.png";
import Down from "../../Image/down.png";
import Up from "../../Image/up.png";
import { RiBillFill } from "react-icons/ri";
import { ImUserTie } from "react-icons/im";
import axios from "axios";
import { PiWarningCircle } from "react-icons/pi";
import { Link } from "react-router-dom";

function MyOrderPage1() {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [steps, setSteps] = useState([]);
  const [callingWaiter, setCallingWaiter] = useState(false); // Yeni state

  function ShoWBtn() {
    setShowPaymentPopup((p) => !p);
  }

  // Ofisiant çağırma funksiyası
  const callWaiter = async () => {
    if (callingWaiter) return; // Əgər artıq çağırılıbsa, dayandır

    setCallingWaiter(true);

    try {
      const orderId = localStorage.getItem("order_id");
      if (!orderId) {
        alert("Sifariş ID-si tapılmadı!");
        setCallingWaiter(false);
        return;
      }

      // Masa statusunu yenilə
      const response = await axios.patch(
        `http://172.20.5.167:8001/api/tables/${order.table.id}/`,
        {
          status: "waitingWaiter",
        }
      );

      if (response.status === 200) {
        alert("Ofisiant çağırıldı ✅");

        // Sifariş məlumatlarını yenilə
        const res = await axios.get("http://172.20.5.167:8001/api/baskets/");
        const list = Array.isArray(res.data) ? res.data : [];
        const currentOrder = list.find((o) => o.id.toString() === orderId);

        if (currentOrder) {
          setOrder(currentOrder);
        }
      }
    } catch (error) {
      console.error("Ofisiant çağırma xətası:", error);
      alert("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setCallingWaiter(false);
    }
  };

  // food_status → steps
  const generateSteps = (foodStatus) => {
    if (!foodStatus || !Array.isArray(foodStatus)) return [];

    const stepConfig = [
      { key: "sendOrder", label: "Sifariş qəbul edildi" },
      { key: "sendKitchen", label: "Sifariş aşpaza göndərildi" },
      { key: "makeFood", label: "Yemək hazırlanır" },
      { key: "deliveredFood", label: "Təhvil verildi" },
    ];

    let activeFound = false;

    return stepConfig
      .map((step, index) => {
        const statusItem = foodStatus[index];
        if (!statusItem) return null;

        const status = statusItem[step.key] === true;
        let isActive = false;

        if (!status && !activeFound) {
          isActive = true;
          activeFound = true;
        }

        return {
          id: index + 1,
          time: statusItem.time || "",
          label: step.label,
          status,
          isActive,
        };
      })
      .filter(Boolean);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const tableNum = localStorage.getItem("table_num");

        if (!tableNum) {
          setError("Masa nömrəsi tapılmadı.");
          setLoading(false);
          return;
        }

        // Sifarişləri çək
        const res = await axios.get("http://172.20.5.167:8001/api/baskets/");
        const list = Array.isArray(res.data) ? res.data : [];

        // Eyni masa nömrəsi olan sifarişləri tap
        const filtered = list.filter(
          (o) => Number(o.table?.table_num) === Number(tableNum)
        );

        if (filtered.length === 0) {
          setError("Bu masa üçün sifariş tapılmadı.");
          setLoading(false);
          localStorage.removeItem("order_id");
          return;
        }

        // Ən yeni sifarişi götür
        const latest = filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )[0];

        setOrder(latest);
        localStorage.setItem("order_id", latest.id.toString());

        if (latest.food_status) {
          const dynamicSteps = generateSteps(latest.food_status);
          setSteps(dynamicSteps);
        }

        // Məhsulları çək
        const prodRes = await axios.get(
          "http://172.20.5.167:8001/api/products/"
        );
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      } catch (err) {
        setError("Sifariş məlumatı alınmadı.");
        console.error(err);
        localStorage.removeItem("order_id");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  function handleDeleteOrder() {
    setShowDelete((p) => !p);
  }

  if (loading)
    return (
      <div className="loading">
        <p>Yüklənir...</p>
      </div>
    );

  if (error)
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );

  if (!order) return null;

  const {
    table,
    note,
    service_cost,
    total_cost,
    total_time,
    items = [],
    created_at,
  } = order;

  // Tarix formatı
  const orderTime = new Date(created_at).toLocaleTimeString("az-AZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // productID -> məhsul
  const findProduct = (id) => products.find((p) => p.id === Number(id));

  // Əsas məhsullar və `extra_items` qrupu ayır
  const mainItems = Array.isArray(items)
    ? items.filter((it) => it && typeof it === "object" && "name_az" in it)
    : [];

  const extraGroup = Array.isArray(items)
    ? items.find((it) => it && Array.isArray(it.extra_items))?.extra_items || []
    : [];

  return (
    <section id="myOrderPage1">
      <div className="frontPage">
        <img src={Left} className="left" alt="left-decor" />
        <img src={Right} className="right" alt="right-decor" />
      </div>

      {/* Silmə popupu */}
      <div
        className={`deletePopup ${showDelete ? "open" : ""}`}
        onClick={handleDeleteOrder}
      >
        <div className="deleteBox" onClick={(e) => e.stopPropagation()}>
          <PiWarningCircle className="warnIcon" />
          <p>Sifarişi silmək istədiyinizə əminsiniz?</p>

          <div className="btns">
            <button className="yes" onClick={handleDeleteOrder}>
              Bəli, sil
            </button>
            <button className="no" onClick={() => setShowDelete(false)}>
              Xeyr, ləğv et
            </button>
          </div>
        </div>
      </div>

      {/* Ödəniş popupu */}
      <div
        onClick={ShoWBtn}
        className={`popUp ${showPaymentPopup ? "open" : ""}`}
      >
        <ul onClick={(e) => e.stopPropagation()}>
          <li onClick={() => setPaymentMethod("cash")}>
            <p>Nağd ödəniş</p>
            <input
              type="checkbox"
              checked={paymentMethod === "cash"}
              onChange={() =>
                setPaymentMethod((m) => (m === "cash" ? "" : "cash"))
              }
            />
          </li>

          <li onClick={() => setPaymentMethod("pos")}>
            <p>POS terminal</p>
            <input
              type="checkbox"
              checked={paymentMethod === "pos"}
              onChange={() =>
                setPaymentMethod((m) => (m === "pos" ? "" : "pos"))
              }
            />
          </li>

          <button
            className="confirm-btn"
            disabled={!paymentMethod}
            onClick={() => {
              alert(
                paymentMethod === "cash"
                  ? "Nağd ödəniş seçildi ✅"
                  : "POS terminal seçildi ✅"
              );
              setShowPaymentPopup(false);
            }}
          >
            Təsdiq et
          </button>
        </ul>
      </div>

      <div className="container">
        <header className="page-head">
          <h1>Sifarişlər</h1>
          <p>Sifarişlərinizi izləyin.</p>
        </header>

        {/* 🧾 Dinamik Sifariş */}
        <div className="ticket">
          <img src={Up} className="up-box" alt="" />
          <img src={Down} className="down-box" alt="" />

          <div className="ticket-head">
            <div className="brand">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmg6YrfolWPXiQAQIz0s473J174_G0za4lwA&s"
                alt="brand"
              />
            </div>
            <span className="time">Sifariş vaxtı: {orderTime}</span>
          </div>

          <div className="row two">
            <span>Masa</span>
            <span>№ {table?.table_num}</span>
          </div>

          <div className="row three header">
            <span>Məhsul</span>
            <span>Say</span>
            <span>Qiymət</span>
          </div>

          {/* 🧾 Əsas məhsullar */}
          {mainItems.map((it) => (
            <div
              className="row three"
              key={it.id ?? `${it.product}-${it.name_az}`}
            >
              <span>{it.name_az}</span>
              <span>{it.count}</span>
              <span>
                {(Number(it.cost) * Number(it.count || 1)).toFixed(2)} ₼
              </span>
            </div>
          ))}

          {/* 🧩 Əlavələr */}
          {extraGroup.length > 0 && (
            <>
              {extraGroup.map((ex) => {
                const p = findProduct(ex.productID);
                const unit = Number(p?.cost || 0);
                const total = (unit * Number(ex.count || 1)).toFixed(2);

                return (
                  <div
                    className="row three"
                    key={ex.id ?? `${ex.productID}-${ex.count}`}
                  >
                    <span>{p?.name_az || `Məhsul #${ex.productID}`}</span>
                    <span>{ex.count}</span>
                    <span>{total} </span>
                  </div>
                );
              })}
            </>
          )}

          <div className="row two total">
            <span>Servis haqqı</span>
            <span>
              {service_cost} <p>₼</p>
            </span>
          </div>

          <div className="row two total">
            <span>Ümumi</span>
            <span>
              {total_cost} <p>₼</p>
            </span>
          </div>

          <div className="row two total">
            <span>Hazırlanma vaxtı</span>
            <span>{total_time} dəqiqə</span>
          </div>

          {note && <p className="note">Qeydiniz: {note}</p>}
        </div>

        {/* Dinamik status gedişi */}
        <div className="steps">
          {steps.map((step, i) => {
            return (
              <div className="step-wrap" key={step.id}>
                {i > 0 && (
                  <div className="seg">
                    <div className="track" />
                    <div
                      className={`fill ${step.status === true ? "on" : ""}`}
                    />
                  </div>
                )}

                <div className={`dot ${step.status === true ? "on" : ""}`}>
                  {step.id}
                </div>

                <div className="meta">
                  <span className={`t ${step.status === true ? "on" : ""}`}>
                    {step.time}
                  </span>
                  <span
                    className={`s ${
                      step.isActive === true
                        ? "mid"
                        : step.status === true
                        ? "strong"
                        : ""
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="btn-row">
          <Link
            id="link"
            to="/product"
            className="primary"
            onClick={() => localStorage.setItem("extraOrder", "true")}
          >
            Sifarişə əlavə et
          </Link>
        </div>

        <div className="hero__actions">
          <button type="button" className="btn btn--primary" onClick={ShoWBtn}>
            <div className="icon">
              <RiBillFill />
            </div>
            <span>Hesabı istə</span>
          </button>

          <button
            type="button"
            className="btn btn--secondary"
            onClick={callWaiter}
            disabled={callingWaiter}
          >
            <div className="icon">
              <ImUserTie />
            </div>
            <span>{callingWaiter ? "Çağırılır..." : "Ofisiantı çağır"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default MyOrderPage1;
