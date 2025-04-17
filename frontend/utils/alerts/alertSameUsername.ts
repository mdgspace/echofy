"use client";
import Swal from "sweetalert2";
import { navigateToLogin } from "../websocket/handleWebSocketClose";
import {AlertSameUserProps } from "../../interface/interface";
const alertSameUsername: AlertSameUserProps = (reason, navigate) => {
    try {
      Swal.fire({
        title: "Username already exists",
        text: "Please choose a different username",
        icon: "warning",
  
        iconColor: "#3670F5",
        imageAlt: "Username Taken",
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

  export default alertSameUsername;