import React, { Dispatch, MutableRefObject, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import alertServerError from "../utils/alerts/alertServerError";

export interface SettingsPopupProps {
    onClose: () => void;           
    soundEnabled: boolean;           
    setSoundEnabled: (enabled: boolean) => void; 
    notificationsEnabled: boolean;  
    setNotificationsEnabled: (enabled: boolean) => void; 
  }
  
export interface RightPaneProps extends SettingsPopupProps {} 
  
  interface IconProps {
    src: string;
    alt: string;
    onClick?: () => void; 
  }
  
export interface LayoutProps {
    children: React.ReactNode;
    home: boolean;
}

export interface TopicDropdownProps {
    topic: string;
    setTopic: (topic: string) => void;
    login: boolean;
  }
  
export interface Project {
    Category: string;
    Name: string;
    ShortDesc: string;
    LongDesc: string;
    ImageLink: string;
    AppStoreLink: string;
    GithubLink: string;
    PlayStoreLink: string;
  }

  export interface TopicSelectionModalProps {
    onClose: () => void;
  }

  export interface UsernameInputProps {
    value: string;
    onChange: (value: string) => void;
  }

export interface NavbarProps{
    currentPage: string;
    currentTopic:string;
  }

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }

  export interface BoxProps {
    channel: "public" | "private" | "chatbot"; 
  }

export interface MailProps {
    isOpen?: boolean;
    onClose: () => void;
    channel: "public" | "private" | "chatbot";
  }
  export interface ProjectListProps {
    projects: Project[];
    category: string;
    heightDecrease?: boolean;
  }

  export interface ProjectCardProps {
    name: string;
    shortDesc: string;
    ImageLink: string;
    Github?: string;
    PlayStore?: string;
    AppStore?: string;
  }

  export interface LoginModalProps {
    onClose: () => void;
    redirect: string;
  }

  export interface ChatBotLoginModalProps {
    onClose: () => void; // Function to close the modal
  }
  export type Topic = "SELECT A TOPIC" | "Option 1" | "Option 2" | string ;
  
  export interface Message {
    isSent: boolean;
    avatar?: string; 
    username: string;
    text: string;
    timestamp: number;
    userID: string;
  }
  export interface ChatContainerProps {
    messages: Message[]; // Assuming messages are serialized JSON strings
    messagesEndRef: React.RefObject<HTMLDivElement>; // Ref to scroll to the bottom
  }
  

  


  export interface UserContextType {
    userName: string | null;
    setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  }

  export interface UserProviderProps {
    children: React.ReactNode;
  }

  export interface UseLoadSettingProps {
    setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    setNotificationsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

  export interface UseSettingsProps {
    soundEnabled: boolean;
    notificationsEnabled: boolean;
  }

  export interface UseVisibilityChangeProps {
    setUnreadCount: Dispatch<SetStateAction<number>>
}

export interface UseWebsocketProps {
  soundEnabled: boolean;
  channel: string;
  socketRef: React.MutableRefObject<WebSocket | null>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  router: any;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

export interface useWebsocketForChatbotProps {
  socketRef: MutableRefObject<WebSocket | null>;
  setMessages: Dispatch<SetStateAction<any[]>>; 
  router: any;
}

interface UseLoadSettingHook {
  (setSoundEnabled: (enabled: boolean) => void, setNotificationsEnabled: (enabled: boolean) => void): void;
}

interface UseSettingsHook {
  (soundEnabled: boolean, notificationsEnabled: boolean): void;
}

interface UseWebsocketForChatbotHook {
  (
    socketRef: React.MutableRefObject<WebSocket | null>, 
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    router: typeof useRouter,
    messagesEndRef: React.MutableRefObject<HTMLDivElement | null>
  ): void;
}

interface UseVisibilityChangeHook {
  (setUnreadCount: React.Dispatch<React.SetStateAction<number>>): void;
}

interface UseLeaveChatHook {
  (router: typeof useRouter, socketRef: React.MutableRefObject<WebSocket | null>): void;
}

interface ChatbotContainerProps {
  messages: Message[];
  messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
}

export interface ProcessWebSocketMessageProps {
  event: MessageEvent;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  navigateToLogin: () => void;
  isChatbot: boolean;
}

export interface DataFromServer {
  userID?: string;
  Message?: string;
  Delete?: string;
}





export interface WebSocketHandlers {
  onOpen: (event: Event) => void;
  onMessage: (event: MessageEvent<any>) => void;
  onClose: (event: CloseEvent) => void;
  onError: (event: Event) => void;
}


export type AlertSameUserProps = (reason: string, navigate: NavigateFunction) => void;
export type AlertBadRequestProps = (reason: string, navigate: NavigateFunction) => void;
export type AlertServerErrorProps = (reason: string, navigate: NavigateFunction) => void;

export interface WebSocketURLParams {
  userId: string;
  username: string;
  channel: string;
  topic?: string;
}

export interface URLBuilderParams {
  host: string;
  port: string;
  protocol: string;
}

export interface LeaveChatURLParams {
  userID: string;
}

export interface ChatContainerProps {
  messages: Message[]; // An array of message objects
  messagesEndRef: React.RefObject<HTMLDivElement>; // A ref for auto-scrolling to the bottom of the chat
}

export interface AvatarListProps {
  AvatarList: string[]; // List of avatar image paths/URLs
}

export interface ChatInputBoxProps {
  socketRef: React.MutableRefObject<WebSocket | null>;
}



export type CheckAndPromptSessionChange = (
  currentUser: string,
  newUsername: string,
  onSessionChange: () => void
) => Promise<boolean>;

export type GetSessionUser = () => string | null;
export type GetSessionUserId = () => string | null;
export type SetSessionUser = (username: string) => void;
export type RemoveSessionUserId = () => void;

export interface LeaveChatResponse {
  // Define the expected properties of the response here
  success: boolean;
  message?: string;
}

// Define the return type of the fetchProjects function
export type FetchProjectsResponse = Project[]; // Array of projects

// Define the interface for a project
export interface Project {
  id: string; // Adjust the type as per your actual API response
  name: string; // Example property
  description?: string; // Optional property
  // Add more properties as needed based on your project data structure
}

// Define the interface for the subscribe response
export interface SubscribeResponse {
  code: number;
  message: string;
}

// Define the parameters for the subscribe function
export interface SubscribeParams {
  email: string;
  username: string;
  userId: string;
  channel: string;
  timestamp: number;
}

// Define an interface for the environment variables
export interface BackendEnvironment {
  NEXT_PUBLIC_BACKEND_HOST: string;
  NEXT_PUBLIC_BACKEND_PORT: string;
  NEXT_PUBLIC_BACKEND_ENVIRONMENT: 'development' | 'production';
}

// Create a type for the optional topic parameter

export type NavigateFunction = (path: string) => void;

export type AlertBannedUser = (reason: string, navigate: NavigateFunction) => void;

export type AlertAbnormalCloseProps = (reason: string, navigate: NavigateFunction) => void;
