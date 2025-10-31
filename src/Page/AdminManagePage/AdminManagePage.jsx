import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminManagePage.scss";
import ChaqrLoading from "../../Components/Loading/Loading";
import OrderModal from "./OrderModal";
import ConfirmationModal from "./ConfirmationModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AdminManagePage() {
  const [stats, setStats] = useState([
    { title: "Boş masalar", count: 0 },
    { title: "Ümumi sifarişlər", count: 0 },
    { title: "Ləğv olunan sifarişlər", count: 0 },
    { title: "Təhvil verilən sifarişlər", count: 0 },
  ]);

  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmationType, setConfirmationType] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/baskets/`);
      setOrders(response.data);

      // Statistika hesabla
      const emptyTables = response.data.filter(o => !o.is_cancelled).length;
      const totalOrders = response.data.length;
      const cancelledOrders = response.data.filter(o => o.is_cancelled).length;
      const deliveredOrders = response.data.filter(
        o => o.food_status?.[3]?.deliveredFood
      ).length;

      setStats([
        { title: "Boş masalar", count: emptyTables },
        { title: "Ümumi sifarişlər", count: totalOrders },
        { title: "Ləğv olunan sifarişlər", count: cancelledOrders },
        { title: "Təhvil verilən sifarişlər", count: deliveredOrders },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setConfirmationType("delete-item");
    setShowConfirmation(true);
  };

  const handleCancelOrder = () => {
    setConfirmationType("cancel");
    setShowConfirmation(true);
  };

  const handleSendToKitchen = () => {
    setConfirmationType("kitchen");
    setShowConfirmation(true);
  };

  const handlePrintReceipt = () => {
    setConfirmationType("print");
    setShowConfirmation(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmationType === "cancel") {
        await axios.patch(`${API_BASE_URL}/api/baskets/${selectedOrder.id}/`, {
          is_cancelled: true,
          cancelled_at: new Date().toISOString(),
        });
      } else if (confirmationType === "kitchen") {
        // ✅ Mətbəxə göndər
        const updatedBasket = {
          table_id: selectedOrder.table.id,
          note: selectedOrder.note || "",
          items: selectedOrder.items
            .filter(item => !item.extra_items)
            .map(item => ({
              product: item.product,
              count: item.count
            })),
          food_status: [...(selectedOrder.food_status || [{}, {}, {}, {}])]
        };

        updatedBasket.food_status[1] = {
          sendKitchen: true,
          time: new Date().toISOString() // ✅ ISO format
        };

        await axios.put(`${API_BASE_URL}/api/baskets/${selectedOrder.id}/`, updatedBasket);
      } else if (confirmationType === "print") {
        window.print();
      } else if (confirmationType === "delete-item" && itemToDelete) {
        const updatedItems = selectedOrder.items.filter(it => it.id !== itemToDelete.id);
        await axios.patch(`${API_BASE_URL}/api/baskets/${selectedOrder.id}/`, {
          items: updatedItems
        });
      }

      await fetchData();
    } catch (error) {
      console.error("Action failed:", error);
      alert("Əməliyyat uğursuz oldu");
    }

    setShowConfirmation(false);
    setConfirmationType(null);
    setItemToDelete(null);

    if (confirmationType !== "delete-item") {
      closeModal();
    }
  };

  const handleCancelAction = () => {
    setShowConfirmation(false);
    setConfirmationType(null);
    setItemToDelete(null);
  };

  if (loading) {
    return <ChaqrLoading />;
  }

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
              className={`order-card statuss-${order.statusColor || "warning"}`}
            >
              <div className="order-header">
                <span className="order-number">
                  Masa № {order.table?.table_num || order.table}
                </span>
                <span
                  className={`status-badgee status-${
                    order.statusColor || "warning"
                  }`}
                >
                  ● {order.status || "Hazırlanır"}
                </span>
              </div>
              <div className="order-infoo">
                <div className="info-row">
                  <span className="label">Sifarış nömrəsi</span>
                  <span className="value">
                    {order.orderNumber || order.order_number || `#${order.id}`}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Hesab</span>
                  <div className="value">
                    {Number(
                      order.price || order.total_price || order.total_cost || 0
                    ).toFixed(2)}{" "}
                    <p> ₼</p>
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

      <OrderModal
        isOpen={isModalOpen}
        selectedOrder={selectedOrder}
        onClose={closeModal}
        onDeleteItem={handleDeleteItem}
        onCancelOrder={handleCancelOrder}
        onSendToKitchen={handleSendToKitchen}
        onPrintReceipt={handlePrintReceipt}
      />

      <ConfirmationModal
        isOpen={showConfirmation}
        confirmationType={confirmationType}
        itemToDelete={itemToDelete}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
}

export default AdminManagePage;
