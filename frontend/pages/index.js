import Image from "next/image";
import ChatInputBox from "../components/chatInputBox";
import ChatContainer from "../components/chatContainer";
import arrow from "../assets/arrow.svg";
import Box from "../components/mdgBox";
import RightPane from "../components/rightPane";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  getSessionUser,
  getSessionUserId,
  handleWebSocketClose,
  handleWebSocketError,
  processWebSocketMessage,
} from "../services/utilities/utilities";
import { buildWebSocketURL } from "../services/url-builder/url-builder";
import { initializeWebSocketConnection } from "../services/api/api";
import { useRouter } from "next/navigation";
import notif from "../assets/sounds/notif.mp3";
import notifRecieve from "../assets/sounds/notif-recieve.mp3";
import { AiFillAccountBook } from "react-icons/ai";
import { AiFillCamera } from "react-icons/ai";
// import boxData from "../services/utilities/box-data";
import { BsStarFill } from "react-icons/bs";
import {slack} from ".././assets/slack.svg";
import {mail} from ".././assets/mail.svg";
import {logo} from "../assets/logo.svg";
import Navbar from "../components/navbar";
import Mail from "../components/mail"
import Modal from "../components/modal";
import login from "./login";
import {useHistory} from "react-router-dom";
export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
}

  const goToPublicChat = () => {
    router.push('/login'); // Use the router to navigate to the "/chat" route
    openModal();
    localStorage.setItem('chatType', 'public'); // Store the chat type in local storage
     // Open the modal after navigating
  };

const goToPrivateChat = () => {
  router.push('/login'); // Use the router to navigate to the "/chat" route
    openModal();
    localStorage.setItem('chatType', 'private'); 

};

const goToChatbot = () =>{
  router.push('/login');
  openModal();
  localStorage.setItem('chatType', 'chatbot');
}


  
  return (
    <>
    
<div className = "sticky top-0 z-10">
      <Navbar />
</div>
    
    <div className="main text-slate-950 bg- w-full h-screen bg-contain ">
      

      <div className="grid grid-cols-24 w-full h-screen">


        <div className="justify-between col-span-7 bg-gray-50 rounded-r-xl max-md:hidden">
          <div className="flex flex-col items-center gap-4 p-5 w-562 h-1000 bg-white rounded-xl">
            <Box />
          </div>
          
          
          
        </div>



        
        {/*<div className="col-span-1 max-md:hidden max-sm:hidden">
          <RightPane
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
          />
        </div>*/}

<div className="col-span-17 mx-[3vw] bg-gray-100 max-md:col-span-24 mt-5 ">
<div className="flex flex-col h-screen">

<div class="flex flex-col justify-center items-center w-1339 h-980 p-50 md:p-32 lg:p-340 gap-16 lg:gap-64 flex-shrink-0">

<div className="flex flex-col justify-center items-center  ">
    <div class="text-blue-500 font-lato font-medium text-4xl leading-72 tracking-wide">
    Welcocme to Echofy 
    </div>
    <div class="text-gray-600 text-center font-lato font-medium text-lg leading-33 mt-5 tracking-wide">
    We've developed this resource to address any inquiries you may have regarding the MDG Space group at IIT Roorkee, including its events and projects. You can engage with our chatbot or reach out to us directly on Slack. We're eager to assist you.
    </div>
</div>

</div >
<div  className="flex flex-col justify-center items-center ">
<button className="flex h-20 w-20 mx-20 px-20 my-5 w-1/2 justify-center items-center gap-2  rounded-full bg-blue-500" onClick={goToChatbot} >
<p className="text-white text-center font-roboto font-medium text-lg leading-20 tracking-tighter">
  Talk to our ChatBot
</p>
</button>
<Modal isOpen={isModalOpen} onClose={closeModal}>

        <button onClick={closeModal}>Close Modal</button>
      </Modal>

<button className="flex h-20 w-20 mx-20 px-20 my-5 w-1/2 justify-center items-center gap-2  rounded-full bg-blue-500" onClick={goToPrivateChat}>
<p className="text-white text-center font-roboto font-medium text-lg leading-20 tracking-tighter">
      Private Chat on Slack
</p>
</button>
<button className="flex h-20 w-20 mx-20 px-20 my-5 w-1/2 justify-center items-center gap-2  rounded-full bg-blue-500" onClick={goToPublicChat}>
<p className="text-white text-center font-roboto font-medium text-lg leading-20 tracking-tighter">
Public MDG Chat Forum
</p>
</button>


</div>



  

</div>
</div>
      
      </div>
    </div>
    </>
  );
}





