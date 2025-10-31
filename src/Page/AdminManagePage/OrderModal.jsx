import React from "react";
import { IoMdClose } from "react-icons/io";

function OrderModal({
  isOpen,
  selectedOrder,
  onClose,
  onDeleteItem,
  onCancelOrder,
  onSendToKitchen,
  onPrintReceipt,
}) {
  if (!isOpen || !selectedOrder) return null;

  // Məhsulların ümumi qiyməti (servis haqqı olmadan)
  const subtotal = (selectedOrder.mainItems || selectedOrder.items || []).reduce(
    (sum, item) => sum + Number((item.cost || item.price) * (item.count || item.quantity) || 0),
    0
  );

  // Servis haqqı
  const serviceCharge = Number(selectedOrder.service_cost || 0);

  // Ümumi məbləğ (servis haqqı ilə)
  const grandTotal = Number(selectedOrder.total_cost || selectedOrder.total_price || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <IoMdClose />
        </button>

        <div className="ticket">
          <div className="ticket-head">
            <div className="brand">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmg6YrfolWPXiQAQIz0s473J174_G0za4lwA&s"
                alt="brand"
              />
            </div>
            <div className="header-info">
              <span className="time">
                Sifariş vaxtı:{" "}
                {selectedOrder.orderTime ||
                  new Date(selectedOrder.created_at).toLocaleTimeString(
                    "az-AZ"
                  )}
              </span>
              <span className="order-number">
                Sifariş №:{" "}
                {selectedOrder.orderNumber ||
                  selectedOrder.order_number ||
                  `#${selectedOrder.id}`}
              </span>
            </div>
          </div>

          <div className="dotted-line"></div>

          <div className="row two">
            <span>Masa</span>
            <span>
              № {selectedOrder.table?.table_num || selectedOrder.table}
            </span>
          </div>

          <div className="row four header">
            <span>Məhsul</span>
            <span>Say</span>
            <span>Qiymət</span>
            <span>Sil</span>
          </div>

          {(selectedOrder.mainItems || selectedOrder.items || []).map(
            (it) => (
              <div className="row four" key={it.id}>
                <span>{it.name_az || it.product?.name_az}</span>
                <span>{it.count || it.quantity}</span>
                <span>
                  {Number(
                    (it.cost || it.price) * (it.count || it.quantity) || 0
                  ).toFixed(2)} ₼
                </span>

                <span
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(it);
                  }}
                >
                  <IoMdClose />
                </span>
              </div>
            )
          )}

          <div className="dotted-line"></div>

          <div className="row two subtotal">
            <span>Ara Toplam</span>
            <span>{subtotal.toFixed(2)} ₼</span>
          </div>

          <div className="row two service">
            <span>Servis haqqı</span>
            <span>{serviceCharge.toFixed(2)} ₼</span>
          </div>

          <div className="row two total">
            <span>Ümumi</span>
            <span>{grandTotal.toFixed(2)} ₼</span>
          </div>

          {selectedOrder.note && (
            <div className="note">
              <p>Qeyd: {selectedOrder.note}</p>
            </div>
          )}

          <div className="modal-actions">
            <button className="action-btn cancel-btn" onClick={onCancelOrder}>
              Sifarişi ləğv et
            </button>
            <button
              className="action-btn kitchen-btn"
              onClick={onSendToKitchen}
            >
              Mətbəxə göndər
            </button>
            <button className="action-btn print-btn" onClick={onPrintReceipt}>
              Çeki çap et
            </button>
          </div>

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
  );
}

export default OrderModal;
