import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import "./AdminManagePage.scss";

function AdminManagePage() {
  const [stats] = useState([
    { title: "Boş mostolar", count: 40 },
    { title: "Ümumi sifarişlər", count: 40 },
    { title: "Lady salonu sifarişlər", count: 40 },
    { title: "Təhvil verilən sifarişlər", count: 40 },
  ]);

  const [orders] = useState([
    {
      id: 1,
      orderNumber: "#288392",
      reference: "#705",
      status: "Hazırlanır",
      statusColor: "warning",
      price: "4.50",
      table: 12,
      orderTime: "14:30",
      total_cost: 4.5,
      note: "Zəhmət olmasa yeməkdə pul bibəri az istifadə edərsiniz.",
      mainItems: [{ id: 1, name_az: "Qatıq", count: 1, cost: "4.50" }],
    },
    {
      id: 2,
      orderNumber: "#288393",
      reference: "#705",
      status: "Hazırdır",
      statusColor: "infoo",
      price: "30.00",
      table: 8,
      orderTime: "13:15",
      total_cost: 30.0,
      note: "",
      mainItems: [
        { id: 1, name_az: "Dönər", count: 2, cost: "12.00" },
        { id: 2, name_az: "Ayran", count: 2, cost: "3.00" },
      ],
    },
    {
      id: 3,
      orderNumber: "#288394",
      reference: "#705",
      status: "İctimai orta",
      statusColor: "success",
      price: "0.00",
      table: 5,
      orderTime: "12:45",
      total_cost: 0,
      note: null,
      mainItems: [],
    },
    {
      id: 4,
      orderNumber: "#288395",
      reference: "#705",
      status: "Ortamətqəhvə",
      statusColor: "primary",
      price: "49.50",
      table: 15,
      orderTime: "15:20",
      total_cost: 49.5,
      note: "Tez gətirin",
      mainItems: [
        { id: 1, name_az: "Espresso", count: 3, cost: "4.50" },
        { id: 2, name_az: "Tiramisu", count: 2, cost: "18.00" },
      ],
    },
    {
      id: 5,
      orderNumber: "#288396",
      reference: "#705",
      status: "Uğdu yerləri",
      statusColor: "danger",
      price: "42.00",
      table: 20,
      orderTime: "16:00",
      total_cost: 42.0,
      note: "",
      mainItems: [
        { id: 1, name_az: "Lahmacun", count: 4, cost: "8.00" },
        { id: 2, name_az: "Şalgam", count: 4, cost: "2.50" },
      ],
    },
    {
      id: 6,
      orderNumber: "#288397",
      reference: "#705",
      status: "Ortamətqəhvə",
      statusColor: "primary",
      price: "13.00",
      table: 3,
      orderTime: "11:30",
      total_cost: 13.0,
      note: null,
      mainItems: [{ id: 1, name_az: "Cappuccino", count: 2, cost: "6.50" }],
    },
    {
      id: 7,
      orderNumber: "#288398",
      reference: "#705",
      status: "Uğdu yerləri",
      statusColor: "danger",
      price: "61.00",
      table: 11,
      orderTime: "14:10",
      total_cost: 61.0,
      note: "Allergiyam var, qoz əlavə etməyin",
      mainItems: [
        { id: 1, name_az: "Steak", count: 1, cost: "45.00" },
        { id: 2, name_az: "Kartof fri", count: 2, cost: "8.00" },
      ],
    },
    {
      id: 8,
      orderNumber: "#288399",
      reference: "#705",
      status: "Uğdu yerləri",
      statusColor: "danger",
      price: "38.00",
      table: 7,
      orderTime: "13:50",
      total_cost: 38.0,
      note: "",
      mainItems: [
        { id: 1, name_az: "Burger", count: 2, cost: "15.00" },
        { id: 2, name_az: "Fanta", count: 2, cost: "4.00" },
      ],
    },
    {
      id: 9,
      orderNumber: "#288400",
      reference: "#705",
      status: "Uğdu yerləri",
      statusColor: "danger",
      price: "200.00",
      table: 18,
      orderTime: "15:45",
      total_cost: 200.0,
      note: "VIP müştəri",
      mainItems: [
        { id: 1, name_az: "Lobster", count: 1, cost: "120.00" },
        { id: 2, name_az: "Şərab", count: 1, cost: "80.00" },
      ],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Confirmation popup states
  const [confirmationType, setConfirmationType] = useState(null); // 'cancel', 'kitchen', 'print', 'delete-item'
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleViewDetails = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Delete item handler - confirmation popup açır
  const handleDeleteItemClick = (item, event) => {
    event.stopPropagation();
    setItemToDelete(item);
    setConfirmationType("delete-item");
    setShowConfirmation(true);
  };

  // Action button handlers
  const handleCancelOrderClick = () => {
    setConfirmationType("cancel");
    setShowConfirmation(true);
  };

  const handleSendToKitchenClick = () => {
    setConfirmationType("kitchen");
    setShowConfirmation(true);
  };

  const handlePrintReceiptClick = () => {
    setConfirmationType("print");
    setShowConfirmation(true);
  };

  // Confirmation handlers
  const handleConfirmAction = () => {
    if (confirmationType === "cancel") {
      console.log("✅ Sifariş ləğv edildi");
      // API çağırışı: cancelOrderAPI(selectedOrder.id)
    } else if (confirmationType === "kitchen") {
      console.log("✅ Mətbəxə göndərildi");
      // API çağırışı: sendToKitchenAPI(selectedOrder.id)
    } else if (confirmationType === "print") {
      console.log("✅ Çek çap edilir");
      // Print funksionallığı: window.print() və ya API
    } else if (confirmationType === "delete-item" && itemToDelete) {
      console.log("✅ Məhsul silindi:", itemToDelete);
      // API çağırışı: deleteOrderItemAPI(selectedOrder.id, itemToDelete.id)
      // State-dən silinmə:
      // setSelectedOrder({
      //   ...selectedOrder,
      //   mainItems: selectedOrder.mainItems.filter(item => item.id !== itemToDelete.id)
      // })
    }

    setShowConfirmation(false);
    setConfirmationType(null);
    setItemToDelete(null);

    // Yalnız order actions üçün modal bağlan
    if (confirmationType !== "delete-item") {
      closeModal();
    }
  };

  const handleCancelAction = () => {
    setShowConfirmation(false);
    setConfirmationType(null);
    setItemToDelete(null);
  };

  // Confirmation mesajını qaytarır
  const getConfirmationMessage = () => {
    switch (confirmationType) {
      case "cancel":
        return "Sifarişi ləğv etməkdən əminsiniz?";
      case "kitchen":
        return "Mətbəxə göndərməkdən əminsiniz?";
      case "print":
        return "Çeki çap etməkdən əminsiniz?";
      case "delete-item":
        return itemToDelete
          ? `"${itemToDelete.name_az}" məhsulunu silməkdən əminsiniz?`
          : "Bu məhsulu silməkdən əminsiniz?";
      default:
        return "Bu əməliyyatdan əminsiniz?";
    }
  };

  // Confirmation button mətnini qaytarır
  const getConfirmButtonText = () => {
    switch (confirmationType) {
      case "cancel":
        return "Sifarişi ləğv et";
      case "kitchen":
        return "Mətbəxə göndər";
      case "print":
        return "Çeki çap et";
      case "delete-item":
        return "Məhsulu sil";
      default:
        return "Təsdiq et";
    }
  };

  // Confirmation button class-ını qaytarır
  const getConfirmButtonClass = () => {
    switch (confirmationType) {
      case "cancel":
        return "cancel-btn";
      case "kitchen":
        return "kitchen-btn";
      case "print":
        return "print-btn";
      case "delete-item":
        return "cancel-btn";
      default:
        return "";
    }
  };

  return (
    <div className="admin-manage-page">
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-title">{stat.title}</div>
            <div className="stat-count">{stat.count}</div>
          </div>
        ))}
      </div>

      <div className="orders-section">
        <h2 className="section-title">Cari sifarişlər</h2>
        <div className="orders-grid">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`order-card statuss-${order.statusColor}`}
            >
              <div className="order-header">
                <span className="order-number">Masa № {order.table}</span>
                <span className={`status-badgee status-${order.statusColor}`}>
                  ● {order.status}
                </span>
              </div>
              <div className="order-infoo">
                <div className="info-row">
                  <span className="label">Sifarış nömrəsi</span>
                  <span className="value">{order.orderNumber}</span>
                </div>
                <div className="info-row">
                  <span className="label">Hesab</span>
                  <div className="value">
                    {order.price} <p> ₼</p>
                  </div>
                </div>
              </div>
              <button
                className="details-btn"
                onClick={() => handleViewDetails(order.id)}
              >
                Ətraflı bax <span className="arrow">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <IoMdClose />
            </button>

            <div className="ticket">
              {/* Header with Brand and Info */}
              <div className="ticket-head">
                <div className="brand">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmg6YrfolWPXiQAQIz0s473J174_G0za4lwA&s"
                    alt="brand"
                  />
                </div>
                <div className="header-info">
                  <span className="time">
                    Sifariş vaxtı: {selectedOrder.orderTime}
                  </span>
                  <span className="order-number">
                    Sifariş №: {selectedOrder.orderNumber}
                  </span>
                </div>
              </div>

              {/* Dotted Line */}
              <div className="dotted-line"></div>

              {/* Table Number */}
              <div className="row two">
                <span>Masa</span>
                <span>№ {selectedOrder.table}</span>
              </div>

              {/* Products Table Header */}
              <div className="row four header">
                <span>Məhsul</span>
                <span>Say</span>
                <span>Qiymət</span>
                <span>Sil</span>
              </div>

              {/* Products List */}
              {selectedOrder.mainItems.map((it) => (
                <div className="row four" key={it.id}>
                  <span>{it.name_az}</span>
                  <span>{it.count}</span>
                  <span>
                    {(Number(it.cost) * Number(it.count)).toFixed(2)}
                  </span>
                  <span
                    className="delete-icon"
                    onClick={(e) => handleDeleteItemClick(it, e)}
                  >
                    <IoMdClose />
                  </span>
                </div>
              ))}

              {/* Total */}
              <div className="row two total">
                <span>Ümumi</span>
                <span>{selectedOrder.total_cost.toFixed(2)} ₼</span>
              </div>

              {/* Note */}
              {selectedOrder.note && (
                <div className="note">
                  <p>Qeyd: {selectedOrder.note}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="modal-actions">
                <button
                  className="action-btn cancel-btn"
                  onClick={handleCancelOrderClick}
                >
                  Sifarişi ləğv et
                </button>
                <button
                  className="action-btn kitchen-btn"
                  onClick={handleSendToKitchenClick}
                >
                  Mətbəxə göndər
                </button>
                <button
                  className="action-btn print-btn"
                  onClick={handlePrintReceiptClick}
                >
                  Çeki çap et
                </button>
              </div>

              {/* Payment Section */}
              <div className="payment-section">
                <h3>Ödəniş üsulu</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="checkbox" name="cash" />
                    <span>Nəğd ödəniş</span>
                  </label>
                  <label className="payment-option">
                    <input type="checkbox" name="pos" />
                    <span>POS terminal</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    confirmationType === "cancel" ||
                    confirmationType === "delete-item"
                      ? "#ef4444"
                      : confirmationType === "kitchen"
                      ? "#10b981"
                      : "#3b82f6"
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

export default AdminManagePage;
