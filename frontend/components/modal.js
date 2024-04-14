// components/Modal.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Modal({ isOpen, onClose, children }) {
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
