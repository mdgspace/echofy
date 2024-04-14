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
  const finalArr = newArr.map((item) => item.toUpperCase())


const isShown = router.pathname === '/';


  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjectsData() {
      const data = await fetchProjects();
      setProjects(data);
    }

    fetchProjectsData();

  }, []);

  const handleRoute1 = () => {
    if(channel === "public"){
      router.push("/private_chat")
    }
    else if(channel === "private"){
      router.push("/chat")
    }
    else{
      router.push("/chat")
    }
  }

  const handleRoute2 = () => {
    if(channel === "public"){
      router.push("/chat_bot")
    }
    else if(channel === "private"){
      router.push("/chat_bot")
    }
    else{
      router.push("/chat_bot")
    }
  }
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
      <div class="flex flex-col gap-3 justify-between items-center">
        <div class="Projects">
          <ProjectList projects={projectList} category="Projects" heightDecrease={isShown} />

        </div>
        <div class="Events">
          <ProjectList projects={eventList} category="Events" heightDecrease={isShown}/>
        </div>

        {
        !isShown &&
        (<div className="w-full h-[3vh] gap-2 flex items-center">
        <div className="w-1/2 flex-grow bg-blue rounded-full bg-customBlue border-customBlue hover:cursor-pointer flex-2 hover:to-blue-900 dark:hover:bg-blue-600" >
          <div className="p-2.5">
            <div className="text-white text-sm font-small text-Roboto leading-tight tracking-tight text-center text-Roboto font-medium  " onClick = {handleRoute1}  >JOIN {finalArr[0]} CHAT</div>
          </div>
        </div>
        <div className=" w-1/2 flex-grow bg-blue rounded-full border bg-white border-customBlue hover:bg-gray-50 hover:cursor-pointer flex-2 text-center dark:hover:bg-gray-100">
          <div className="p-2.5">
            <div className=" text-sm text-customBlue border-collapse font-roboto leading-tight tracking-tight text-Roboto font-medium " onClick={handleRoute2}>JOIN {finalArr[1]} CHAT</div>
          </div>
        </div>
      </div>)
      
      }


      </div>

      
      

    </>
  );
}
