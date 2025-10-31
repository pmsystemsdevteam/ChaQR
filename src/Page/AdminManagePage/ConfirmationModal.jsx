import React from "react";

function ConfirmationModal({
  isOpen,
  confirmationType,
  itemToDelete,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

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

  const getIconColor = () => {
    if (confirmationType === "cancel" || confirmationType === "delete-item") {
      return "#ef4444";
    } else if (confirmationType === "kitchen") {
      return "#10b981";
    }
    return "#3b82f6";
  };

  return (
    <div className="confirmation-overlay" onClick={onCancel}>
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
              fill={getIconColor()}
            />
          </svg>
        </div>

        <h2 className="confirmation-title">{getConfirmationMessage()}</h2>

        <div className="confirmation-buttons">
          <button className="confirmation-btn back-btn" onClick={onCancel}>
            Geri
          </button>
          <button
            className={`confirmation-btn ${getConfirmButtonClass()}`}
            onClick={onConfirm}
          >
            {getConfirmButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
