"use client";
import Swal from "sweetalert2";

export default function alertBadRequest(reason, navigateToLogin) {
    try {
      Swal.fire({
        title: "Bad request",
        text: `Please try again ${reason}`,
        icon: "warning",
  
        iconColor: "#3670F5",
        confirmButtonColor: "#3670F5",
        confirmButtonText: "OK",
        didOpen: (popup) => {
          popup.style.borderRadius = "1rem";
        },
      }).then((result) => {
        try {
          if (result.isConfirmed) navigateToLogin();
        } catch (error) {}
      });
    } catch (error) {}
  }