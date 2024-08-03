"use client";
import Swal, { SweetAlertResult } from "sweetalert2";

export default async function checkAndPromptSessionChange(
  currentUsername: string | null,
  inputUsername: string,
  onConfirm: () => void,
  ) {
    if (currentUsername && currentUsername !== inputUsername) {
      try {
        const result:SweetAlertResult = await Swal.fire({
          title: "Change Username?",
          text: `You already have a running session with the username "${currentUsername}". Do you want to change your username?`,
          icon: "question",
          iconColor: "#3670F5",
  
          showCancelButton: true,
          confirmButtonColor: "3670F5",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, change it!",
        });
  
        if (result.isConfirmed && inputUsername.length < 20) {
          onConfirm();
          return true;
        } else {
          if (inputUsername.length > 20) {
            Swal.fire({
              title: "Username too long",
              text: `Please choose a username with less than 20 characters`,
              icon: "warning",
  
              iconColor: "#3670F5",
              confirmButtonColor: "3670F5",
              confirmButtonText: "OK",
              didOpen: (popup:HTMLElement) => {
                popup.style.borderRadius = "1rem";
              },
            });
          }
          return false;
        }
      } catch (error) {
        console.error("Error with SweetAlert2:", error);
        return false;
      }
    }
    return false;
  }