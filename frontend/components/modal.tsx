import { useEffect } from "react";
import { useRouter } from "next/router";
import { ModalProps } from "../interface/interface";

export default function Modal({ isOpen, onClose, children }:ModalProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      onClose();
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, onClose]);

  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal">
      <div className="modal-content">{children}</div>
    </div>
  );
}