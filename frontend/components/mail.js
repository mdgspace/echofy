import React from 'react'

export default function Mail ({ onClose}){
  const popupRef = React.useRef();

    React.useEffect(() => {
      function handleClickOutside(event) {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          onClose();
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [popupRef, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-gray bg-opacity-50">
  <div ref={popupRef} className="flex flex-col justify-center items-center gap-4 w-80 md:w-96 h-auto p-8 border border-gray-200 rounded-lg shadow-md bg-gray-100 px-10 py-20">
    <p className="text-black font-Lato font-medium text-lg">
      Enter your email to get a reply
    </p>
    <div className="flex flex-col justify-center items-center py-4 w-full">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2  rounded-lg text-center placeholder-gray-secondary  placeholder-center"
      /> 
    </div>
    <div
      onClick={onClose}
      className="bg-customBlue hover:bg-blue-700 text-white text-center font-Roboto font-medium py-2 px-4 rounded-full w-full"
    >
      Submit
    </div>
  </div>
</div>


      );
    }


      
  



