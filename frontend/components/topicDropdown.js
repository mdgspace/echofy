"use client"

import React, { useState } from 'react';
import { fetchProjects } from '../services/api/projectsApi';
import { useEffect } from 'react';
import { useRouter } from "next/router"

export const TopicDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const[topic, setTopic] = useState(" ");
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjectsData() {
      const data = await fetchProjects();
      setProjects(data);
      console.log(data);
    }

    fetchProjectsData();

  }, []);

  const handleClick = (e) => {
    const content = e.target.textContent;
    setTopic(content);
    router.push({
      pathname: "/chat_bot",
      query: { topic: content },
      }, 
    )


  }

  const projectList = projects.filter(project => project.Category === 'Projects');
  const eventList = projects.filter(project => project.Category === 'Events');
  console.log(eventList)


  return (
    <div className="relative inline-block bg-white text-customBlue">
  <button
    className="text-customBlue bg-white border border-dotted border-customBlue hover:text-white hover:bg-blue-700 focus:ring-2 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center   dark:focus:ring-blue-800"
    onClick={toggleDropdown}
    type="button"
  >
Topics
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
  </button>
  {isOpen && (
    <div className="relative inline-block bg-white text-customBlue">
      <div className="absolute z-10 right-0 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg mt-5">
        <div className="max-h-32 overflow-y-auto">
          <ul className="py-2 text-sm text-gray-800 dark:text-gray-200">
            <li className="font-bold text-gray-700 ml-2">Projects</li>
            {projectList.map((project, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="block px-4 py-2 text-customBlue hover:bg-gray-100 dark:hover:bg-customBlue dark:hover:text-white" onClick={handleClick}
                >
                  {project.Name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="max-h-32 overflow-y-auto">
          <ul className="py-2 text-sm text-gray-600 dark:text-gray-200">
            <li className="font-bold text-gray-600 ml-2">Events</li>
            {eventList.map((event, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="block px-4 py-2 text-customBlue hover:bg-gray-100 dark:hover:bg-customBlue dark:hover:text-white " onClick={handleClick}
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


