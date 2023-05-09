import React, { useState } from "react";
import styles from "/home/panda/jinora-revamp-frontend/components/layout.module.css";
import background from "./../assets/bg.jpg"

export default function LoginScreen() {
  const [username, setUsername] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleLoginClick = () => {
    console.log(`Logging in as ${username}...`);
    // Perform login logic here
  };

  const handleCancelClick = () => {
    setUsername("");
    console.log("Login cancelled.");
  };

  return (
    // <div className="container">
    <img src={background}/>
    
    //   <div className="login-container">
    //     <h1>Login</h1>
    //     <h2>.mdg</h2>
    //     <input
    //       id="usernameInput"
    //       type="text"
    //       placeholder="Username"
    //       value={username}
    //       onChange={handleUsernameChange}
    //     />
    //     <br></br>
    //     <button onClick={handleLoginClick}>Chat with Us</button>
    //     <button onClick={handleCancelClick}>FAQs</button>
    //   </div>
    // </div>
  );
}
