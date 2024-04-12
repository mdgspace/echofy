"use client"
import Image from 'next/image';
import { use, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { fetchProjects } from '../services/api/projectsApi';
import { ProjectList } from './projectList';


export default function Box({channel}) {
  const router = useRouter();
  const arr = ['public' , 'private' , 'chatbot']
  const newArr = arr.filter((item) => item !== channel)


const isShown = router.pathname === '/';


  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjectsData() {
      const data = await fetchProjects();
      setProjects(data);
    }

    fetchProjectsData();

  }, []);

  
  const [topic, setTopic] = useState(" ");
  const handleDivClick = (e) => {
    const content = e.target.textContent;
    setTopic(content);
    router.push({
      pathname: '/chat_bot',
      query: { topic: content }
    })
  }


  const projectList = projects.filter(project => project.Category === 'Projects');
  const eventList = projects.filter(project => project.Category === 'Events');

  return (
    <>
      <div class="flex flex-col justify-between items-center">
        <div class="Projects">
          <ProjectList projects={projectList} category="Projects" />

        </div>
        <div class="Events">
          <ProjectList projects={eventList} category="Events" />
        </div>
      </div>

      {
        !isShown &&
        (<div className="self-stretch h-12 justify-start  gap-2 flex items-center">
        <div className="flex-grow bg-blue rounded-full bg-customBlue border-customBlue hover:cursor-pointer flex-2" >
          <div className="p-2.5">
            <div className="text-white text-sm font-small text-Roboto leading-tight tracking-tight text-center ">Join {newArr[0]} chat</div>
          </div>
        </div>
        <div className="flex-grow bg-blue rounded-full border bg-white border-customBlue hover:bg-gray-50 hover:cursor-pointer flex-2 text-center">
          <div className="p-2.5">
            <div className=" text-sm text-customBlue  font-medium font-roboto leading-tight tracking-tight ">Join {newArr[1]} chat</div>
          </div>
        </div>
      </div>)
      
      }
      

    </>
  );
}
