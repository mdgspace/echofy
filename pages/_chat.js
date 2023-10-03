import Image from 'next/image'
import ChatInputBox from '../components/chatInputBox';
import ChatContainer from '../components/chatContainer';
import arrow from '../assets/arrow.svg'
import {Roboto } from 'next/font/google'

import { useState } from "react";

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
  })

export default function Home() {
    const [messages, setMessages] = useState([]); // Define messages state in the Home component

  // Create a function to update messages in the Home component
  function updateMessages(newMessage) {
    setMessages([...messages, { text: newMessage, isSent: true }]);
  }
    return (
        <div className="main text-slate-950 bg-[url('../assets/bg.svg')] bg-auto w-full h-screen bg-contain">
            <div className="grid grid-cols-16 w-full h-screen">
                <div className="col-span-2 bg-bg-orange">
                    .mdg
                </div>
                <div className="col-span-13 mx-[3vw] bg-transparent">
                    <div className="grid grid-rows-12 h-screen">
                        <div className="row-span-1 bg-slate-200">
                            <div className="grid grid-cols-8  h-full noir-pro">
                                <div className="col-span-1 flex flex-col justify-end">
                                    Queries
                                </div>
                                <div className="col-span-1 flex flex-col justify-end">
                                    <div className='flex flex-row'>
                                        <div>Templates</div>
                                        <div>
                                            <Image src={arrow} alt=""></Image>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-6 text-right flex flex-col justify-end">
                                    Join Slack
                                </div>
                            </div>
                        </div>
                        <div className="row-span-10 bg-slate-300">
                        <ChatContainer messages={messages} />
                        </div>
                        <div className="row bg-slate-400">
                           <ChatInputBox updateMessages={updateMessages}/>
                        </div>
                    </div>
                </div>
                <div className="div bg-bg-orange">
                </div>
            </div>
        </div>
    )
}
