import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChefHomePage.scss";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { IoIosAlert } from "react-icons/io";
import ChaqrLoading from "../../Components/Loading/Loading";

const API_URL = "http://localhost:8000/api/chef";

function ChefHomePage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  // Confirmation popup states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // İlk yükləmə
  useEffect(() => {
    fetchStats();
  }, []);

  // Tab dəyişəndə
  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  // Statistika
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats/`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Statistika xətası:", error);
    }
  };

  // Sifarişləri gətir
  const fetchOrders = async (status) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/orders/`, {
        params: { status },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Sifariş yükləmə xətası:", error);
    } finally {
      setLoading(false);
    }
  };

  // Qəbul et
  const handleAcceptClick = (order) => {
    setSelectedOrder(order);
    setConfirmationType("accept");
    setShowConfirmation(true);
  };

  // Ləğv et
  const handleRejectClick = (order) => {
    setSelectedOrder(order);
    setConfirmationType("reject");
    setShowConfirmation(true);
  };

  // Bitir
  const handleFinishClick = (order) => {
    setSelectedOrder(order);
    setConfirmationType("finish");
    setShowConfirmation(true);
  };

  // Təsdiq
  const handleConfirmAction = async () => {
    if (!selectedOrder) return;

    try {
      let endpoint = "";
      if (confirmationType === "accept") {
        endpoint = `${API_URL}/orders/${selectedOrder.id}/accept/`;
      } else if (confirmationType === "reject") {
        endpoint = `${API_URL}/orders/${selectedOrder.id}/reject/`;
      } else if (confirmationType === "finish") {
        endpoint = `${API_URL}/orders/${selectedOrder.id}/finish/`;
      }

      const response = await axios.post(endpoint);

      if (response.data.success) {
        await fetchStats();
        await fetchOrders(activeTab);
      }
    } catch (error) {
      console.error("Əməliyyat xətası:", error);
      alert("Xəta baş verdi!");
    } finally {
      setShowConfirmation(false);
      setConfirmationType(null);
      setSelectedOrder(null);
    }
  };

  // Popup bağla
  const handleCancelAction = () => {
    setShowConfirmation(false);
    setConfirmationType(null);
    setSelectedOrder(null);
  };

  // Mesaj
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

  // Vaxt formatla: dd.mm.yyyy HH:MM
  const formatDateTime = (dateString) => {
    if (!dateString) return "Təyin edilməyib";
    
    const date = new Date(dateString);
    
    // Yoxla ki, date düzgün olsun
    if (isNaN(date.getTime())) return "N/A";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  // Status təyin et
  const getOrderStatus = (order) => {
    // Ləğv edilmişmi?
    if (order.is_cancelled) return "cancelled";
    
    if (!order.food_status || order.food_status.length === 0) return "pending";

    const status = order.food_status;
    
    // Təhvil verilib
    if (status[3]?.deliveredFood) return "finished";
    
    // Hazırlanır
    if (status[2]?.makeFood) return "accepted";
    
    // Gözləyir
    return "pending";
  };

  return (
    <div id="chefHomePage">
      {/* Üst status bar */}
      <div className="order-status-container">
        <div
          className={`order-card ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          <h4>Gözləyən sifarişlər</h4>
          <p className="count">{stats.pending}</p>
        </div>

        <div
          className={`order-card ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          <h4>Bitən sifarişlər</h4>
          <p className="count">{stats.completed}</p>
        </div>

        <div
          className={`order-card ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          <h4>Ləğv edilən sifarişlər</h4>
          <p className="count">{stats.cancelled}</p>
        </div>
      </div>

      {/* Sifariş kartları */}
      <div className="orderPage">
        {loading ? (
          <ChaqrLoading />
        ) : orders.length === 0 ? (
          <div className="no-orders">Sifariş yoxdur</div>
        ) : (
          orders.map((order) => {
            const status = getOrderStatus(order);

            return (
              <div
                className={`orderPaper ${
                  status === "finished"
                    ? "finished"
                    : status === "cancelled"
                    ? "cancelled"
                    : ""
                }`}
                style={{
                  border:
                    status === "finished"
                      ? "1px solid #11B059"
                      : status === "cancelled"
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
                        : status === "cancelled"
                        ? "#CCAF14"
                        : "",
                    color:
                      status === "finished" || status === "cancelled"
                        ? "white"
                        : "",
                  }}
                >
                  Masa №{order.table?.table_num || "N/A"}
                </h3>
                <p className="order-id">Sifariş №{order.id}</p>

                <div className="order-time">
                  <div className="orderrr">
                    <p>Sifariş vaxtı:</p>
                    <span>{formatDateTime(order.created_at)}</span>
                  </div>
                  <div className="orderrr">
                    <p>Təhvil vaxtı:</p>
                    <span>
                      {order.food_status?.[3]?.time
                        ? formatDateTime(order.food_status[3].time)
                        : order.cancelled_at
                        ? formatDateTime(order.cancelled_at)
                        : "Təyin edilməyib"}
                    </span>
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
  {order.items && order.items.length > 0 ? (
    order.items.flatMap((item, index) => {
      // Əgər item extra_items container-idirsa
      if (item.extra_items) {
        return item.extra_items.map((extra, idx) => (
          <tr key={`extra-${index}-${idx}`}>
            <td style={{ textAlign: "start" }}>
              {extra.product?.name_az || extra.name_az || "N/A"}
            </td>
            <td style={{ textAlign: "center" }}>{extra.count || 1}</td>
            <td style={{ textAlign: "end" }}>
              {extra.time || 0} dəqiqə
            </td>
          </tr>
        ));
      }
      
      // Normal item
      return (
        <tr key={index}>
          <td style={{ textAlign: "start" }}>
            {item.name_az || "N/A"}
          </td>
          <td style={{ textAlign: "center" }}>{item.count}</td>
          <td style={{ textAlign: "end" }}>
            {item.time || 0} dəqiqə
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="3" style={{ textAlign: "center" }}>
        Məhsul yoxdur
      </td>
    </tr>
  )}
</tbody>

                </table>

                {order.note && (
                  <div className="note-section">
                    <p>Qeyd: {order.note}</p>
                  </div>
                )}

                <p
                  className="prep-time"
                  style={{
                    color:
                      status === "finished"
                        ? "#11B059"
                        : status === "cancelled"
                        ? "#CCAF14"
                        : "",
                  }}
                >
                  Hazırlanma vaxtı: {order.total_time || 0} dəqiqə
                </p>

                <div className="order-actions">
                  {/* Gözləyən sifarişlər - Qəbul et və Ləğv et */}
                  {status === "pending" && (
                    <>
                      <button
                        className="accept"
                        onClick={() => handleAcceptClick(order)}
                      >
                        Qəbul et
                      </button>
                      <button
                        className="reject"
                        onClick={() => handleRejectClick(order)}
                      >
                        Ləğv et
                      </button>
                    </>
                  )}

                  {/* Qəbul edilmiş - Bitir düyməsi */}
                  {status === "accepted" && (
                    <button
                      className="finish"
                      onClick={() => handleFinishClick(order)}
                    >
                      Bitir
                    </button>
                  )}

                  {/* Bitmiş - Yaşıl işarə */}
                  {status === "finished" && (
                    <div className="completed-badge">
                      <IoCheckmarkCircleSharp />
                    </div>
                  )}

                  {/* Ləğv edilmiş - Sarı xəbərdarlıq işarəsi */}
                  {status === "cancelled" && (
                    <div className="completed-badge" style={{ color: "#CCAF14" }}>
                      <IoIosAlert />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
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
