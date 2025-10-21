import React, { useState } from "react";
import "./AdminOrdersPage.scss";
import { FiCheck } from "react-icons/fi";

function AdminOrdersPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([
    "Ləğv edilen sifarişlər",
    "Hazırlanan sifarişlər",
  ]);

  const statusOptions = [
    "Ləğv edilen sifarişlər",
    "Hazırlanan sifarişlər",
    "Bitən sifarişlər",
  ];

  const toggleStatus = (status) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const orders = [
    {
      id: 1,
      table: 12,
      orderTime: "12:25",
      status: "new",
      mainItems: [{ id: 1, name_az: "Qatıq", count: 1, cost: 4.5 }],
      extraGroup: [],
      service_cost: 0.0,
      total_cost: 9.0,
      total_time: 15,
      note: "Zəhmət olmasa yeməkdə pul bibəri az istifadə edərsiniz.",
    },
    {
      id: 2,
      table: 12,
      orderTime: "12:25",
      status: "preparing",
      mainItems: [
        { id: 1, name_az: "Qatıq", count: 1, cost: 4.5 },
        { id: 2, name_az: "Çörək", count: 2, cost: 2.0 },
      ],
      extraGroup: [],
      service_cost: 0.0,
      total_cost: 12.5,
      total_time: 20,
      note: "",
    },
    {
      id: 3,
      table: 8,
      orderTime: "13:15",
      status: "ready",
      mainItems: [
        { id: 1, name_az: "Dönər", count: 1, cost: 8.0 },
        { id: 2, name_az: "Kola", count: 1, cost: 3.0 },
      ],
      extraGroup: [],
      service_cost: 0.0,
      total_cost: 11.0,
      total_time: 18,
      note: "Əlavə sous",
    },
  ];

  // Status mətnini qaytarır
  const getStatusText = (status) => {
    switch (status) {
      case "new":
        return "Yeni sifariş";
      case "preparing":
        return "Hazırlanır";
      case "ready":
        return "Hazırdır";
      case "delivered":
        return "Təhvil verilib";
      case "cancelled":
        return "Ləğv edilib";
      default:
        return "Naməlum";
    }
  };

  // Status rəngini qaytarır
  const getStatusClass = (status) => {
    switch (status) {
      case "new":
        return "status-new";
      case "preparing":
        return "status-preparing";
      case "ready":
        return "status-ready";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

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
                  key={status}
                  className="sort-menu-item"
                  onClick={() => toggleStatus(status)}
                >
                  <span>{status}</span>
                  <div
                    className={`checkbox ${
                      selectedStatuses.includes(status) ? "checked" : ""
                    }`}
                  >
                    {selectedStatuses.includes(status) && <FiCheck />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="order-grid">
        {orders.map((order) => (
          <div key={order.id} className="ticket">
            <div className="ticket-head">
              <div className="brand">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmg6YrfolWPXiQAQIz0s473J174_G0za4lwA&s"
                  alt="brand"
                />
              </div>
              <span className="time">Sifariş vaxtı: {order.orderTime}</span>
            </div>

            <div className="row two masa-row">
              <span>Masa</span>
              <span>№ {order.table}</span>
            </div>

            <div className="row three header">
              <span>Məhsul</span>
              <span>Say</span>
              <span>Qiymət</span>
            </div>

            {order.mainItems.map((it) => (
              <div className="row three" key={it.id}>
                <span>{it.name_az}</span>
                <span>{it.count}</span>
                <span>{(Number(it.cost) * Number(it.count)).toFixed(2)} ₼</span>
              </div>
            ))}

            <div className="row two total">
              <span>Ümumi</span>
              <span>{order.total_cost.toFixed(2)} ₼</span>
            </div>

            {order.note && <p className="note">Qeyd: {order.note}</p>}

            {/* Status məlumatı */}
            <div className={`status-badge ${getStatusClass(order.status)}`}>
              {getStatusText(order.status)}
            </div>
          
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminOrdersPage;
