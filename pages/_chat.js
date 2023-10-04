import Image from 'next/image'
import ChatInputBox from '../components/chatInputBox';
import ChatContainer from '../components/chatContainer';
import arrow from '../assets/arrow.svg'
import Box from '../components/mdgBox';
import RightPane from '../components/rightPane';

import { useState } from "react";

export default function Home() {
    const [messages, setMessages] = useState([]); // Define messages state in the Home component

    // Create a function to update messages in the Home component
    function updateMessages(newMessage) {
        setMessages([...messages, { text: newMessage, isSent: false }]);
    }
    return (
        <div className="main text-slate-950 bg-[url('../assets/bg.svg')] bg-auto w-full h-screen bg-contain">
            <div className="grid grid-cols-16 w-full h-screen">
                <div className="col-span-2 bg-bg-orange rounded-r-xl">
                    <div className='p-2 text-white outfit'>.mdg</div>
                    <div className="pt-[5vh] w-full flex flex-col align-center justify-items-center">
                        {Array(5).fill().map((_, index) => (
                            <Box key={index} />
                        ))}
                    </div>
                </div>
                <div className="col-span-13 mx-[3vw] bg-transparent">
                    <div className="flex flex-col h-screen">
                        <div className="flex flex-row">
                            <div className="grid grid-cols-8  h-[10vh] noir-pro-bold">
                                <div className="col-span-1 flex flex-col justify-end">
                                    <div className='hover:shadow-[0px_0px_20px_-15px_rgba(0,0,0,1)] hover:cursor-pointer bg-bg-orange rounded-lg text-white flex flex-col justify-end mx-[1vw]'>
                                        <center>Queries</center>
                                    </div>
                                </div>
                                <div className="col-span-1 flex flex-col justify-end">
                                    <div className='flex flex-row '>
                                        <div>Templates</div>
                                        <div className='mt-[1vh]'>
                                            <Image src={arrow} alt="" className='scale-[2.0] ml-[1vw]'></Image>
                                        </div>
                                    </div>
                                </div>
                                <div className="hover:cursor-pointer col-span-6 text-right flex flex-col justify-end text-bg-orange">
                                    Join Slack
                                </div>
                            </div>
                        </div>
                        <div className="h-[70vh] overflow-y-auto noir-pro">
                            <ChatContainer messages={messages} />
                        </div>
                        <div className="h-[20vh]">
                            <ChatInputBox updateMessages={updateMessages} />
                        </div>
                    </div>
                </div>
                <div className=" flex flex-row">
                    <div className="w-[40%]"></div>
                    <div className="w-[60%] bg-bg-orange rounded-l-md shadow-[0px_0px_20px_-5px_rgba(0,0,0,1)]">
                        <RightPane/>
                    </div>
                </div>
            </div>
        </div>
    )
}
