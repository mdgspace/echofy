import React, { createContext, useState, ReactNode } from "react";

// Define UserContext type (recommended for better type safety)
interface UserContextType {
  userName: string | null;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>   

  );
};