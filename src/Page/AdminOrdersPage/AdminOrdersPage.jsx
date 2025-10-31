import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminOrdersPage.scss";
import { FiCheck } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AdminOrdersPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [selectedStatuses, setSelectedStatuses] = useState([
  "cancelled",
  "preparing",
  "delivered",
  "new",
  "pending",
]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 const statusOptions = [
  { value: "pending", label: "Yeni sifarişlər" },        // Qəbul edilib, hələ mətbəxə göndərilməyib
  { value: "new", label: "Mətbəxə göndərilən" },        // Mətbəxə göndərilib, qəbul olunmayıb
  { value: "preparing", label: "Hazırlanan sifarişlər" }, // Chef qəbul edib, hazırlanır
  { value: "delivered", label: "Bitən sifarişlər" },      // Təhvil verilib
  { value: "cancelled", label: "Ləğv edilən sifarişlər" }, // Ləğv olunub
];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/baskets/`);
      setOrders(response.data);
    } catch (error) {
      console.error("Sifarişlər yüklənmədi:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (statusValue) => {
    if (selectedStatuses.includes(statusValue)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== statusValue));
    } else {
      setSelectedStatuses([...selectedStatuses, statusValue]);
    }
  };

  const getOrderStatus = (order) => {
    if (order.is_cancelled) return "cancelled";
    if (order.food_status?.[3]?.deliveredFood) return "delivered";
    if (order.food_status?.[2]?.makeFood) return "preparing";
    if (order.food_status?.[1]?.sendKitchen) return "new";
    return "pending";
  };

  const getStatusText = (status) => {
    switch (status) {
      case "new":
        return "Yeni sifariş";
      case "preparing":
        return "Hazırlanır";
      case "delivered":
        return "Təhvil verilib";
      case "cancelled":
        return "Ləğv edilib";
      case "pending":
        return "Gözləyir";
      default:
        return "Naməlum";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "new":
        return "status-new";
      case "preparing":
        return "status-preparing";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      case "pending":
        return "status-pending";
      default:
        return "";
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filtr tətbiq et
  const filteredOrders = orders.filter((order) => {
    const status = getOrderStatus(order);
    return selectedStatuses.includes(status);
  });

  if (loading) {
    return (
      <section id="adminOrdersPage">
        <div className="loading">Yüklənir...</div>
      </section>
    );
  }

  return (
    <section id="adminOrdersPage">
      <div className="header">
        <h2>Bütün sifarişlər</h2>

        <div className="sort-wrapper">
          <div className="sort-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span>Sifarişləri sırala</span>
            <span className="arrow">{isMenuOpen ? "▴" : "▾"}</span>
          </div>

          {isMenuOpen && (
            <div className="sort-menu">
              {statusOptions.map((status) => (
                <div
                  key={status.value}
                  className="sort-menu-item"
                  onClick={() => toggleStatus(status.value)}
                >
                  <span>{status.label}</span>
                  <div
                    className={`checkbox ${
                      selectedStatuses.includes(status.value) ? "checked" : ""
                    }`}
                  >
                    {selectedStatuses.includes(status.value) && <FiCheck />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="order-grid">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">Sifariş tapılmadı</div>
        ) : (
          filteredOrders.map((order) => {
            const status = getOrderStatus(order);

            return (
              <div key={order.id} className="ticket">
                <div className="ticket-head">
                  <div className="brand">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmg6YrfolWPXiQAQIz0s473J174_G0za4lwA&s"
                      alt="brand"
                    />
                  </div>
                  <span className="time">
                    Sifariş vaxtı: {formatTime(order.created_at)}
                  </span>
                </div>

                <div className="row two masa-row">
                  <span>Masa</span>
                  <span>№ {order.table?.table_num || "N/A"}</span>
                </div>

                <div className="row three header">
                  <span>Məhsul</span>
                  <span>Say</span>
                  <span>Qiymət</span>
                </div>

                {order.items?.map((it) => (
                  <div className="row three" key={it.id}>
                    <span>{it.name_az}</span>
                    <span>{it.count}</span>
                    <span>
                      {(Number(it.cost) * Number(it.count)).toFixed(2)} ₼
                    </span>
                  </div>
                ))}

                <div className="row two total">
                  <span>Ümumi</span>
                  <span>{Number(order.total_cost || 0).toFixed(2)} ₼</span>
                </div>

                {order.note && <p className="note">Qeyd: {order.note}</p>}

                <div className={`status-badge ${getStatusClass(status)}`}>
                  {getStatusText(status)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default AdminOrdersPage;
