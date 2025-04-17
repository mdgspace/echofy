import React from "react";
import { TopicSelectionModalProps } from "../interface/interface";


const TopicSelectionModal: React.FC<TopicSelectionModalProps> = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <p>Please select a topic from the left pane.</p>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded focus:outline-none"
          onClick={onClose}
        >
          Close
        </button>
      </div>  
    </div>
  );
};

export default TopicSelectionModal;
