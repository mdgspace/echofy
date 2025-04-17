import React, { createContext, useState, ReactNode } from "react";
import { UserContextType, UserProviderProps } from "../interface/interface";


export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>   

  );
};