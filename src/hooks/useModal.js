import React, { useContext } from "react";
import ModalContext from "../context/ModalProvider";

function useModal() {
  const { isModal, setIsModal } = useContext(ModalContext);
  return useContext(ModalContext);
}

export default useModal;
