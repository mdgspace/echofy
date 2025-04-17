"use client";
import Swal from "sweetalert2";
import { AlertServerErrorProps } from "../../interface/interface";
import { navigateToLogin } from "../websocket/handleWebSocketClose";
const alertServerError: AlertServerErrorProps = (reason, navigate) => {
    try {
      Swal.fire({
        title: "Server error",
        text: `Please try again ${reason}`,
        icon: "warning",
  
        iconColor: "#3670F5",
        confirmButtonColor: "#3670F5",
        confirmButtonText: "OK",
        didOpen: (popup:HTMLElement) => {
          popup.style.borderRadius = "1rem";
        },
      }).then((result) => {
        try {
          if (result.isConfirmed) navigate("/");
        } catch (error) {}
      });
    } catch (error) {}
  }

  export default alertServerError;