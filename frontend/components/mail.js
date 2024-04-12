import React from 'react'
import { useState } from 'react';
import subscribe from '../services/api/subscribeApi';

export default function Mail ({isOpen , onClose ,username, userId, channel, timestamp}){
  
  
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      console.log('email', email)

      console.log(timestamp)
      console.log(channel)
      await subscribe(email, username, userId, channel, timestamp)
      onClose();
    }catch(error){
      console.log('error' , error);
    }
  }

    if(!isOpen){
        return null;
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
  <div className="flex flex-col justify-center items-center gap-4 w-80 md:w-96 h-auto p-8 border border-gray-200 rounded-lg shadow-md bg-gray-100 px-10 py-20">
    <p className="text-black font-lato font-medium text-lg md:text-xl leading-6 md:leading-8">
      Enter your email to get a reply
    </p>
    <div className="flex flex-col justify-center items-center py-4 w-full">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-center"
      /> 
    </div>
    <button
      onClick={handleSubmit}
      className="bg-blue-500 hover:bg-blue-700 text-white font-Roboto font-bold py-2 px-4 rounded-lg w-full"
    >
      Submit
    </button>
  </div>
</div>


      );
    }



      
  



