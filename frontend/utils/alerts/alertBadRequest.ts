"use client";
import Swal from "sweetalert2";
import { navigateToLogin } from "../websocket/handleWebSocketClose";
import { AlertBadRequestProps } from "../../interface/interface";
const alertBadRequest: AlertBadRequestProps = (reason, navigate) => {
    try {
      Swal.fire({
        title: "Bad request",
        text: `Please try again ${reason}`,
        icon: "warning",
  
        iconColor: "#3670F5",
        confirmButtonColor: "#3670F5",
        confirmButtonText: "OK",
        didOpen: (popup: HTMLElement) => {
          popup.style.borderRadius = "1rem";
        },
      }).then((result) => {
        try {
          if (result.isConfirmed) navigate("/");
        } catch (error) {}
      });
    } catch (error) {}
  }

  export default alertBadRequest;