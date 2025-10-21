import React from "react";
import { IoMdClose } from "react-icons/io";
import "./DeletePopUp.scss";

/**
 * Reusable Delete Confirmation Modal Component
 * @param {boolean} isOpen - Modal açıq olub-olmadığını göstərir
 * @param {function} onClose - Modal bağlananda çağırılan funksiya
 * @param {function} onConfirm - Sil düyməsi basılanda çağırılan funksiya
 * @param {string} title - Modal başlığı
 * @param {string} message - Silinmə mesajı
 * @param {string} confirmText - Təsdiq düyməsinin mətni (default: "Sil")
 * @param {string} cancelText - Ləğv düyməsinin mətni (default: "Geri")
 */
function DeletePopUp({
  isOpen,
  onClose,
  onConfirm,
  title = "Məlumat silinsin?",
  message = "Bu məlumatı silmək istədiyinizdən əminsiniz?",
  confirmText = "Sil",
  cancelText = "Geri",
}) {
  if (!isOpen) return null;

  // Overlay-ə basıldıqda modal bağlanır
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Sil düyməsinə basıldıqda
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // ESC düyməsi ilə bağlama
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <div className="delete-confirm-modal-overlay" onClick={handleOverlayClick}>
      <div className="delete-confirm-modal-content">
        <button className="delete-confirm-modal-close" onClick={onClose}>
          <IoMdClose />
        </button>

        <div className="delete-confirm-modal-body">
          <div className="delete-confirm-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                fill="#ef4444"
              />
            </svg>
          </div>

          <h2 className="delete-confirm-title">{title}</h2>
          <p className="delete-confirm-message">{message}</p>
        </div>

        <div className="delete-confirm-modal-footer">
          <button className="delete-confirm-btn-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button className="delete-confirm-btn-delete" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePopUp;
