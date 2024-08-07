"use client";
import React, { useState } from "react";
import { fetchProjects } from "../services/api/projectsApi";
import { useEffect, useRef } from "react";

export const TopicDropdown = ({ topic, setTopic,login }) => {
  const popupRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const projectList = projects.filter(
    (project) => project.Category === "Projects",
  );
  const eventList = projects.filter((project) => project.Category === "Events");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (e) => {
    const content = e.target.textContent;
    setTopic(content);
    if(!login){
      window.location.href = `/chat_bot?topic=${encodeURIComponent(content)}`;
    }
  };

  useEffect(() => {
    async function fetchProjectsData() {
      const data = await fetchProjects();
      if (data!=null){
        setProjects(data);
      }else{
      setProjects([]);
      }
    }
    fetchProjectsData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupRef, isOpen]);
  return (
    <div 
    ref={popupRef} 
    className={login?"text-customBlue hover:cursor-pointer text-Lato":"text-customBlue hover:cursor-pointer"}>
      <div
        className={login?"text-customBlue hover:text-white hover:bg-customBlue focus:ring-2 focus:outline-none font-medium rounded-full text-base px-5 py-2.5 text-center inline-flex items-center":"text-customBlue  hover:text-white hover:bg-customBlue focus:ring-2 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center inline-flex items-center"}
        onClick={toggleDropdown}
        type="div"
      >
        {`${topic}`}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="relative inline-block text-customBlue">
          <div className="absolute z-10 right-0 w-56 bg-white divide-y divide-gray-100 shadow-lg mt-5 rounded-lg">
            <div className="max-h-48 overflow-y-auto">
              <ul className="py-2 text-lg">
                <li className="font-bold text-customBlue ml-2 text-txt-gray">
                  Projects
                </li>
                {projectList.map((project, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-customBlue hover:bg-gray-100 dark:hover:bg-customBlue dark:hover:text-white"
                      onClick={handleClick}
                    >
                      {project.Name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="max-h-48 overflow-y-auto">
              <ul className="py-2 text-lg">
                <li className="font-bold text-customBlue ml-2 text-txt-gray">
                  Events
                </li>
                {eventList.map((event, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-customBlue hover:bg-gray-100 dark:hover:bg-customBlue dark:hover:text-white "
                      onClick={handleClick}
                    >
                      {event.Name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};