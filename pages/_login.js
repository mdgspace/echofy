import Image from 'next/image'
import bg from '../assets/bg.svg'
// import { get, set } from './session-store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


/**export const UserContext = React.createContext()
*/
export default function login(){
    const [username, setUsername] = useState('');
    const router = useRouter();

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

  function handleChatWithUsClick  ()  {
    setSessionId();
    const user = sessionStorage.getItem('username');
    if(user){
      router.push('/_chat');
    }
  }


   function setSessionId() {
    
    sessionStorage.setItem('username', username);
  }


/**<div className='col-span-2 w-[577px] h-[66px] shrink-0 shadow-[0px_4px_7px_0px_rgba(0,0,0,0.20)] rounded-[10px] '>
           <div className="flex justify-center items-center h-full">
            <div className=" bg-transparent">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    className="w-full p-3 pr-10 border rounded-lg placeholder-gray-400"
                />
            </div>
          </div> */

return (
    <div className="flex justify-center items-center h-full bg-[url('../assets/bg.svg')] bg-auto w-full h-screen bg-contain">
        <div className="flex flex-col space-y-33 m-60 justify-center text-center">
        <div className='w-[696px] h-[535px] shrink-0 opacity-90 shadow-[0px_4px_24px_-1px_rgba(0,0,0,0.25)] backdrop-blur-[20px] rounded-[20px] '>
          
           <div className=" h-[115px] noir-pro text-center mt-[65px]">
            <div className="text-bg-orange text-opacity-60 ">
              LOGIN
            </div>
          </div>
          <div className='h-[60px] outfit text-center text-bg-orange text-opacity-60 p-50 mt-[40px]'>
             .mdg
          </div>
          
          <div className='w-[577px] h-[66px] shrink-0 shadow-[0px_4px_7px_0px_rgba(0,0,0,0.20)] rounded-[10px] mt-[42px] ml-[60px]'>
          <div className="flex justify-center items-center h-full p-50">
            <div className=" bg-transparent">
            <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                   
                />
              </div></div>
          </div>
          
          <div className="w-[238px] h-[66px] shrink-0 rounded-[10px] bg-white ml-[60px] mt-[40px] cursor-pointer">
            <div className='text-bg-orange noir-pro-small text-center  '
            onClick={handleChatWithUsClick}
            >Chat with Us
            </div>
            <div className='w-[319px] h-[66px] shrink-0 rounded-[10px] bg-bg-orange ml-[300px]  -mr-[100px] -mt-[40px]'>
            <div className='text-white noir-pro-small text-center flex flex-col justify-end  '>
              FAQs
            </div>
            </div>
            
          </div>
          </div>
          </div>
        </div>
)
}