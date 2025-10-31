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
import { MdOutlineError } from "react-icons/md";
import { BiSad } from "react-icons/bi";

function MyOrderPage1() {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [steps, setSteps] = useState([]);
  const [callingWaiter, setCallingWaiter] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  function ShoWBtn() {
    setShowPaymentPopup((p) => !p);
  }

  // Ofisiant çağırma funksiyası
  const callWaiter = async () => {
    if (callingWaiter) return;

    setCallingWaiter(true);

    try {
      const orderId = localStorage.getItem("order_id");
      if (!orderId) {
        alert("Sifariş ID-si tapılmadı!");
        setCallingWaiter(false);
        return;
      }

      const response = await axios.patch(
        `${API_BASE_URL}/api/tables/${order.table.id}/`,
        {
          status: "waitingWaiter",
        }
      );

      if (response.status === 200) {
        alert("Ofisiant çağırıldı ✅");

        const res = await axios.get(`${API_BASE_URL}/api/baskets/`);
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
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
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

      if (!tableNum || tableNum === "null" || tableNum === "undefined") {
        setError("no_order");
        setLoading(false);
        localStorage.removeItem("order_id");
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/api/baskets/`);

      if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
        setError("no_order");
        setLoading(false);
        localStorage.removeItem("order_id");
        return;
      }

      const list = Array.isArray(res.data) ? res.data : [];

      const filtered = list.filter(
        (o) => o.table && Number(o.table?.table_num) === Number(tableNum)
      );

      if (filtered.length === 0) {
        setError("no_order");
        setLoading(false);
        localStorage.removeItem("order_id");
        return;
      }

      const latest = filtered.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )[0];

      // ✅ Masa statusu yoxla
      if (latest.table?.status === "empty") {
        setError("no_order");
        setLoading(false);
        localStorage.removeItem("order_id");
        localStorage.removeItem("table_num"); // ✅ table_num-u da sil
        return;
      }

      setOrder(latest);
      localStorage.setItem("order_id", latest.id.toString());

      if (latest.food_status) {
        const dynamicSteps = generateSteps(latest.food_status);
        setSteps(dynamicSteps);
      }

      const prodRes = await axios.get(`${API_BASE_URL}/api/products/`);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);

      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Server xətası:", err);
      if (axios.isAxiosError(err)) {
        setError("server_error");
      } else {
        setError("server_error");
      }
      localStorage.removeItem("order_id");
      setLoading(false);
    }
  };

  fetchOrder();
}, [API_BASE_URL]);


  function handleDeleteOrder() {
    setShowDelete((p) => !p);
  }

  // Loading state
  if (loading) {
    return (
      <section id="myOrderPage1">
        <div className="frontPage">
          <img src={Left} className="left" alt="left-decor" />
          <img src={Right} className="right" alt="right-decor" />
        </div>
        <div className="container">
          <div className="status-box loading-box">
            <div className="spinner"></div>
            <h2>Yüklənir...</h2>
            <p>Sifariş məlumatları yüklənir, zəhmət olmasa gözləyin.</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state - sifariş yoxdur
  if (error === "no_order") {
    return (
      <section id="myOrderPage1">
        <div className="frontPage">
          <img src={Left} className="left" alt="left-decor" />
          <img src={Right} className="right" alt="right-decor" />
        </div>
        <div className="container">
          <header className="page-head">
            <h1>Sifarişlər</h1>
            <p>Sifarişlərinizi izləyin.</p>
            <p className="order-number">
              Sifariş nömrəsi: {order?.order_number}
            </p>
          </header>

          <div className="status-box no-order-box">
            <BiSad className="status-icon sad-icon" />
            <h2>Aktiv sifariş yoxdur</h2>
            <p>Hal-hazırda heç bir aktiv sifarişiniz yoxdur.</p>
            <p className="sub-text">
              Sifariş vermək üçün aşağıdakı düyməyə klikləyin.
            </p>
            <Link to="/product" className="primary-btn">
              Yeni sifariş yarat
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Error state - server xətası
  if (error === "server_error" || error) {
    return (
      <section id="myOrderPage1">
        <div className="frontPage">
          <img src={Left} className="left" alt="left-decor" />
          <img src={Right} className="right" alt="right-decor" />
        </div>
        <div className="container">
          <header className="page-head">
            <h1>Sifarişlər</h1>
            <p>Sifarişlərinizi izləyin.</p>
          </header>

          <div className="status-box error-box">
            <MdOutlineError className="status-icon error-icon" />
            <h2>Xəta baş verdi</h2>
            <p>Sifariş məlumatları yüklənərkən xəta baş verdi.</p>
            <p className="sub-text">
              Zəhmət olmasa səhifəni yeniləyin və ya bir az sonra yenidən cəhd
              edin.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="primary-btn"
            >
              Səhifəni yenilə
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Normal order display
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

  const orderTime = new Date(created_at).toLocaleTimeString("az-AZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const findProduct = (id) => products.find((p) => p.id === Number(id));

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
          <p className="order-number">Sifariş nömrəsi: {order?.order_number}</p>
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
                    <span>{total} ₼</span>
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
                    {formatDateTime(step.time)}
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
