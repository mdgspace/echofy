import React, { ReactNode } from 'react';
import { AppProps } from 'next/app'; // Import types from Next.js
import { UserProvider } from "../context/userContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
