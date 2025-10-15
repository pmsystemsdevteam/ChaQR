import React, { useState } from "react";
import "./ChefHomePage.scss";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { IoIosAlert } from "react-icons/io";
function ChefHomePage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [orderStatus, setOrderStatus] = useState({}); // Sipariş durumlarını takip etmek için
  const orders = {
    pending: 15,
    completed: 15,
    cancelled: 15,
  };

  // Sipariş durumunu değiştirme fonksiyonu
  const handleOrderStatus = (orderId, status) => {
    setOrderStatus((prev) => ({
      ...prev,
      [orderId]: status,
    }));
  };

  // Örnek sipariş verileri
  const orderData = [
    { id: 231, table: "12" },
    { id: 232, table: "13" },
    { id: 233, table: "14" },
    { id: 234, table: "15" },
    { id: 235, table: "16" },
    { id: 236, table: "17" },
  ];

  return (
    <div id="chefHomePage">
      {/* üst status bar */}
      <div className="order-status-container">
        <div
          className={`order-card ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          <h4>Gözləyən sifarişlər</h4>
          <p className="count">{orders.pending}</p>
        </div>

        <div
          className={`order-card ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          <h4>Bitən sifarişlər</h4>
          <p className="count">{orders.completed}</p>
        </div>

        <div
          className={`order-card ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          <h4>Ləğv edilən sifarişlər</h4>
          <p className="count">{orders.cancelled}</p>
        </div>
      </div>

      {/* sifariş kartı */}
      <div className="orderPage">
        {orderData.map((order) => {
          const status = orderStatus[order.id] || "pending";

          return (
            <div
              className={`orderPaper ${
                status === "finished" ? "finished" : ""
              }`}
              style={{
                border:
                  status === "finished"
                    ? "1px solid #11B059"
                    : status === "rejected"
                    ? "1px solid #CCAF14"
                    : "",
              }}
              key={order.id}
            >
              <h3
                style={{
                  background:
                    status === "finished"
                      ? "#11B059"
                      : status === "rejected"
                      ? "#CCAF14"
                      : "",
                  color:
                    status === "finished"
                      ? "white"
                      : status === "rejected"
                      ? "white"
                      : "",
                }}
              >
                Masa №{order.table}
              </h3>
              <p className="order-id">Sifariş №{order.id}</p>

              <div className="order-time">
                <div className="orderrr">
                  <p>Sifariş vaxtı:</p>
                  <span>B.e , Dekabr 12, 2025 &nbsp; 13:25</span>
                </div>
                <div className="orderrr">
                  <p>Təhvil vaxtı:</p>
                  <span>B.e , Dekabr 12, 2025 &nbsp; 13:50</span>
                </div>
              </div>

              <table className="order-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "start" }}>Sifariş</th>
                    <th style={{ textAlign: "center" }}>Say</th>
                    <th style={{ textAlign: "end" }}>Vaxt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "start" }}>Dolma</td>
                    <td style={{ textAlign: "center" }}>2</td>
                    <td style={{ textAlign: "end" }}>10 dəqiqə</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "start" }}>Qatıq</td>
                    <td style={{ textAlign: "center" }}>1</td>
                    <td style={{ textAlign: "end" }}>1 dəqiqə</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "start" }}>Qatıq</td>
                    <td style={{ textAlign: "center" }}>3</td>
                    <td style={{ textAlign: "end" }}>3 dəqiqə</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "start" }}>Lülə kabab</td>
                    <td style={{ textAlign: "center" }}>1</td>
                    <td style={{ textAlign: "end" }}>15 dəqiqə</td>
                  </tr>
                </tbody>
              </table>

              <div className="note-section">
                <p>
                  Qeyd: Zəhmət olmasa yeməkdə pul bibəri az istifadə edəsiniz.
                </p>
              </div>

              <p
                className="prep-time"
                style={{
                  color:
                    status === "finished"
                      ? "#11B059"
                      : status === "rejected"
                      ? "#CCAF14"
                      : "",
                }}
              >
                Hazırlanma vaxtı: 25 dəqiqə
              </p>

              <div className="order-actions">
                {status === "pending" && (
                  <>
                    <button
                      className="accept"
                      onClick={() => handleOrderStatus(order.id, "accepted")}
                    >
                      Qəbul et
                    </button>
                    <button
                      className="reject"
                      onClick={() => handleOrderStatus(order.id, "rejected")}
                    >
                      Ləğv et
                    </button>
                  </>
                )}

                {status === "accepted" && (
                  <button
                    className="finish"
                    onClick={() => handleOrderStatus(order.id, "finished")}
                  >
                    Bitir
                  </button>
                )}

                {status === "finished" && (
                  <div className="completed-badge">
                    <IoCheckmarkCircleSharp />
                  </div>
                )}

                {status === "rejected" && (
                  <div className="completed-badge" style={{color:"#CCAF14"}}>
                    <IoIosAlert />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChefHomePage;
