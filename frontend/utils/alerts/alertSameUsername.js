"use client";
import Swal from "sweetalert2";

export default function alertSameUsername(reason, navigateToLogin) {
    try {
      Swal.fire({
        title: "Username already exists",
        text: "Please choose a different username",
        icon: "warning",
  
        iconColor: "#3670F5",
        imageAlt: "Username Taken",
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