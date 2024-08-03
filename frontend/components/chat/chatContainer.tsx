import React, { useEffect } from "react";
import Image from "next/image";
import moment from "moment";
import { useState } from "react";
import Avatar1 from "../../assets/avatars/avatar_1.svg";
import Avatar2 from "../../assets/avatars/avatar_2.svg";
import Avatar3 from "../../assets/avatars/avatar_3.svg";
import Avatar4 from "../../assets/avatars/avatar_4.svg";
import Avatar5 from "../../assets/avatars/avatar_5.svg";
import Avatar6 from "../../assets/avatars/avatar_6.svg";
import Avatar7 from "../../assets/avatars/avatar_7.svg";
import Avatar8 from "../../assets/avatars/avatar_8.svg";
import Avatar9 from "../../assets/avatars/avatar_9.svg";
import Avatar10 from "../../assets/avatars/avatar_10.svg";
import Avatar11 from "../../assets/avatars/avatar_11.svg";
import Avatar12 from "../../assets/avatars/avatar_12.svg";
import Avatar13 from "../../assets/avatars/avatar_13.svg";
import Avatar14 from "../../assets/avatars/avatar_14.svg";
import Avatar15 from "../../assets/avatars/avatar_15.svg";
import getAvatar from "../../utils/session/getAvatar";

interface Message {
  text: string;
  isSent: boolean;
  timestamp: number;
  username: string;
  avatar?: string; // Optional avatar URL
}

interface ChatContainerProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>; // Reference to the end of the messages container
}

export default function ChatContainer({ messages, messagesEndRef }: ChatContainerProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return moment(date).format("hh:mm A");
  };

  const AvatarList = [
    Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6, Avatar7, Avatar8,
    Avatar9, Avatar10, Avatar11, Avatar12, Avatar13, Avatar14,   
 Avatar15,
  ];

  const   
 [Avatar, setAvatar] = useState<string>(Avatar1);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    const loadAvatar = async () => {
      const AvatarId = await getAvatar();
      const Avatar = AvatarList[AvatarId];
      setAvatar(Avatar);
    };
    loadAvatar();
  }, [messages]); 

  return (
    <div className="h-[85vh]">
      <ul>
        {messages.map((message, index) => (
          <li
            key={index}
            className={`flex items-start ${
              message.isSent ? "justify-end" : "justify-start"
            } mb-4 mx-6`}
          >
            {/* ... (rest of the message rendering code is the same as before) */}
          </li>
        ))}
      </ul>
      <div ref={messagesEndRef} />
    </div>
  );
}