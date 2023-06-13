import React from "react";
import "./index.css";
import useModal from "../../hooks/useModal";

function Modal({ children }) {
  const { setIsModal } = useModal();

  const handleClose = () => {
    setIsModal(false);
  };
  return (
    <div className="modal-container">
      <div className="modal-subcontainer">
        <div className="modal-container_button">
          <button className="modal-button" onClick={handleClose}>
            x
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
