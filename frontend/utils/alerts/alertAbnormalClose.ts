"use client";
import Swal from "sweetalert2";

export default function alertAbnormalClose(reason, navigateToLogin) {
    try {
      Swal.fire({
        title: "Connection lost",
        text: `Please try again or with a different username ${reason}`,
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