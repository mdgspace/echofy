import Link from "next/link";
import { useState } from "react";

export default function ChatScreen(channelType) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  function handleInputChange(event) {
    setNewMessage(event.target.value);
  }

  function handleSendClick() {
    setMessages([...messages, { text: newMessage, isSent: true }]);
    setNewMessage("");
  }
  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index} className={message.isSent ? "sent" : "received"}>
            {message.text}
          </li>
        ))}
      </ul>
      <div>
        <input type="text" value={newMessage} onChange={handleInputChange} />
        <button onClick={handleSendClick}>Send</button>
      </div>{" "}
      <h1>
        <Link href="/">Go Back</Link>
      </h1>
    </div>
  );
}
