"use client"
import Image from 'next/image';
import { use, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { fetchProjects } from '../services/api/projectsApi';
import { ProjectList } from './projectList';


export default function Box() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjectsData() {
      const data = await fetchProjects();
      setProjects(data);
    }

    fetchProjectsData();

  }, []);

  const router = useRouter();
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

    </>
  );
}
