import React from 'react';
import { AppProps } from 'next/app'; 
import { UserProvider } from "../context/userContext";
import { ToastProvider } from "../context/ToastContext";
import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </UserProvider>
  );
}

export default App;
