"use client";
import React from "react";

export default function parseMessageText(text: string): JSX.Element {
    const replaceURLs = (message: string): string => {
      const urlRegex =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
      return message.replace(urlRegex, (url) => `<a href="${url}">${url}</a>`);
    };
  
    const replaceBoldText = (message: string): string  => {
      return message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    };
  
    const replaceCodeText = (message: string): string => {
      return message.replace(
        /`(.*?)`/g,
        '<code className="!bg-gray-400" style="background-color:#dbdbd7 ; color:#3670F5 ; font-size:16px; padding-left:2px ; padding-right:2px" >$1</code>',
      );
    };
  
    let formattedText = replaceURLs(text);
    formattedText = replaceBoldText(formattedText);
    formattedText = replaceCodeText(formattedText);
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  }