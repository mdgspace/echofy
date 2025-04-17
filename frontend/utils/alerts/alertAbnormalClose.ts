"use client";
import Swal from 'sweetalert2';
import { Dispatch, SetStateAction } from 'react'; // Import types for state setters
import { AlertAbnormalCloseProps } from '../../interface/interface';
import { navigateToLogin } from '../websocket/handleWebSocketClose';

const alertAbnormalClose: AlertAbnormalCloseProps = async (reason, navigate) => { // Make the function async
    try {
        const result = await Swal.fire({ // Corrected line
            title: "Connection lost",
            text: `Please try again or with a different username. Reason: ${reason}`,
            icon: "warning",
            iconColor: "#3670F5",
            confirmButtonColor: "#3670F5",
            confirmButtonText: "OK",
            didOpen: (popup: HTMLElement) => {
                popup.style.borderRadius = "1rem";
            },
        });

        if (result.isConfirmed) {
            navigate("/");
        }
    } catch (error) {
        // More specific error handling here, e.g., log the error
        console.error("Error in SweetAlert:", error);
    }

    return null; // This component doesn't render anything directly, it's just a function
};

export default alertAbnormalClose;
