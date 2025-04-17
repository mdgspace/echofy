"use client";
import Swal, { SweetAlertResult } from "sweetalert2";

// Interface for the function parameters
interface CheckAndPromptSessionChangeProps {
  currentUser: string | null;
  username: string | null;
  onConfirm: () => void;
}

// Function to check and prompt session change using SweetAlert2
export default async function checkAndPromptSessionChange({
  currentUser,
  username,
  onConfirm,
}: CheckAndPromptSessionChangeProps): Promise<boolean> {
  // Check if the current username exists and differs from the input username
  if (currentUser && currentUser !== username) {
    try {
      const result: SweetAlertResult = await Swal.fire({
        title: "Change Username?",
        text: `You already have a running session with the username "${currentUser}". Do you want to change your username?`,
        icon: "question",
        iconColor: "#3670F5",
        showCancelButton: true,
        confirmButtonColor: "#3670F5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      });

      // If the user confirms and the new username is less than 20 characters
      if (result.isConfirmed && username.length < 20) {
        onConfirm();
        return true;
      } else {
        // If the input username exceeds the length limit, display a warning
        if (username.length > 20) {
          Swal.fire({
            title: "Username too long",
            text: `Please choose a username with less than 20 characters`,
            icon: "warning",
            iconColor: "#3670F5",
            confirmButtonColor: "#3670F5",
            confirmButtonText: "OK",
            didOpen: (popup: HTMLElement) => {
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
