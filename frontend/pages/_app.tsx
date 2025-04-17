import React from 'react';
import { AppProps } from 'next/app'; 
import { UserProvider } from "../context/userContext";
import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default App;
