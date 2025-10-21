import React, { useState } from "react";
import "./ChefHomePage.scss";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { IoIosAlert } from "react-icons/io";

function ChefHomePage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [orderStatus, setOrderStatus] = useState({});

  // Confirmation popup states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState(null); // 'accept', 'reject', 'finish'
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const orders = {
    pending: 15,
    completed: 15,
    cancelled: 15,
  };

  const orderData = [
    { id: 231, table: "12" },
    { id: 232, table: "13" },
    { id: 233, table: "14" },
    { id: 234, table: "15" },
    { id: 235, table: "16" },
    { id: 236, table: "17" },
  ];

  // Qəbul et düyməsinə basıldıqda
  const handleAcceptClick = (orderId) => {
    setSelectedOrderId(orderId);
    setConfirmationType("accept");
    setShowConfirmation(true);
  };

  // Ləğv et düyməsinə basıldıqda
  const handleRejectClick = (orderId) => {
    setSelectedOrderId(orderId);
    setConfirmationType("reject");
    setShowConfirmation(true);
  };

  // Bitir düyməsinə basıldıqda
  const handleFinishClick = (orderId) => {
    setSelectedOrderId(orderId);
    setConfirmationType("finish");
    setShowConfirmation(true);
  };

  // Confirmation təsdiqlənəndə
  const handleConfirmAction = () => {
    if (confirmationType === "accept") {
      setOrderStatus((prev) => ({
        ...prev,
        [selectedOrderId]: "accepted",
      }));
      console.log("✅ Sifariş qəbul edildi:", selectedOrderId);
    } else if (confirmationType === "reject") {
      setOrderStatus((prev) => ({
        ...prev,
        [selectedOrderId]: "rejected",
      }));
      console.log("❌ Sifariş ləğv edildi:", selectedOrderId);
    } else if (confirmationType === "finish") {
      setOrderStatus((prev) => ({
        ...prev,
        [selectedOrderId]: "finished",
      }));
      console.log("✅ Sifariş bitirildi:", selectedOrderId);
    }

    setShowConfirmation(false);
    setConfirmationType(null);
    setSelectedOrderId(null);
  };

  // Popup bağlanır
  const handleCancelAction = () => {
    setShowConfirmation(false);
    setConfirmationType(null);
    setSelectedOrderId(null);
  };

  // Confirmation mesajını qaytarır
  const getConfirmationMessage = () => {
    switch (confirmationType) {
      case "accept":
        return "Sifarişi qəbul etməkdən əminsiniz?";
      case "reject":
        return "Sifarişi ləğv etməkdən əminsiniz?";
      case "finish":
        return "Sifarişi bitirməkdən əminsiniz?";
      default:
        return "Bu əməliyyatdan əminsiniz?";
    }
  };

  // Confirmation button mətnini qaytarır
  const getConfirmButtonText = () => {
    switch (confirmationType) {
      case "accept":
        return "Qəbul et";
      case "reject":
        return "Ləğv et";
      case "finish":
        return "Bitir";
      default:
        return "Təsdiq et";
    }
  };

  // Confirmation button class-ını qaytarır
  const getConfirmButtonClass = () => {
    switch (confirmationType) {
      case "accept":
        return "accept-btn";
      case "reject":
        return "reject-btn";
      case "finish":
        return "finish-btn";
      default:
        return "";
    }
  };

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
                      onClick={() => handleAcceptClick(order.id)}
                    >
                      Qəbul et
                    </button>
                    <button
                      className="reject"
                      onClick={() => handleRejectClick(order.id)}
                    >
                      Ləğv et
                    </button>
                  </>
                )}

                {status === "accepted" && (
                  <button
                    className="finish"
                    onClick={() => handleFinishClick(order.id)}
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
                  <div className="completed-badge" style={{ color: "#CCAF14" }}>
                    <IoIosAlert />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="confirmation-overlay" onClick={handleCancelAction}>
          <div
            className="confirmation-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirmation-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  fill={
                    confirmationType === "accept"
                      ? "#FF8640"
                      : confirmationType === "reject"
                      ? "#CCAF14"
                      : "#11B059"
                  }
                />
              </svg>
            </div>

            <h2 className="confirmation-title">{getConfirmationMessage()}</h2>

            <div className="confirmation-buttons">
              <button
                className="confirmation-btn back-btn"
                onClick={handleCancelAction}
              >
                Geri
              </button>
              <button
                className={`confirmation-btn ${getConfirmButtonClass()}`}
                onClick={handleConfirmAction}
              >
                {getConfirmButtonText()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChefHomePage;
