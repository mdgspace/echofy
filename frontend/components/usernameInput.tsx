import React, { useState, ChangeEvent } from 'react';
import { UsernameInputProps } from '../interface/interface';


const UsernameInput: React.FC<UsernameInputProps> = ({ value, onChange }) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="w-[577px] h-[66px] shrink-0 shadow-[0px_4px_7px_0px_rgba(0,0,0,0.20)] rounded-[10px] mt-[50px]">
      <div className="flex justify-center items-center h-full"> 
        <div className="w-full"> 
          <input
            type="text"
            placeholder="Username"
            value={value}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500" 
          />
        </div>
      </div>
    </div>
  );
};

export default UsernameInput;
