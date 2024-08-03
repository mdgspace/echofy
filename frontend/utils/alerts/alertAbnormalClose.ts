"use client";
import Swal from 'sweetalert2';
import { Dispatch, SetStateAction } from 'react'; // Import types for state setters

// Interface for function props (if you need it)
interface AlertAbnormalCloseProps {
  reason: string;
  navigateToLogin: () => void; // Function to navigate (e.g., from useRouter)
}

const AlertAbnormalClose: React.FC<AlertAbnormalCloseProps> = ({ reason, navigateToLogin }) => {
  const handleAlertClose = async () => {
    try {
      const result = await Swal.fire({
        title: "Connection lost",
        text: `Please try again or with a different username. Reason: ${reason}`,
        icon: "warning",
        iconColor: "#3670F5",
        confirmButtonColor: "#3670F5",
        confirmButtonText: "OK",
        didOpen: (popup) => {
          popup.style.borderRadius = "1rem";
        },
      });

      if (result.isConfirmed) {
        navigateToLogin();
      } 
    } catch (error) {
      // More specific error handling here, e.g., log the error
      console.error("Error in SweetAlert:", error);
    }
  };

  return null; // This component doesn't render anything directly, it's just a function
};

export default AlertAbnormalClose;
