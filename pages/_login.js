import Image from 'next/image'
import bg from '../assets/bg.svg'

import { useState } from 'react';


/**export const UserContext = React.createContext()
*/
export default function login(){
    const [username, setUsername] = useState([]);

  function handleUsernameChange (event) {
    setUsername(event.target.value);
  };

  function handleEnterClick  () {
    console.log(`Logging in as ${username}...`);
    
  };

  function handleFAQsClick  ()  {
    setUsername("");
    console.log("Login cancelled.");
  };




return (
    <div className="flex justify-center items-center h-full bg-[url('../assets/bg.svg')] bg-auto w-full h-screen bg-contain">
        <div className='w-[696px] h-[535px] shrink-0 opacity-90 shadow-[0px_4px_24px_-1px_rgba(0,0,0,0.25)] backdrop-blur-[20px] rounded-[20px] '>
          
        </div>
    </div>
)
}