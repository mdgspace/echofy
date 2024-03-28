import Image from 'next/image';
import appetizer from '../assets/appetizer.svg'
import security_app from '../assets/security_app.svg'
import soc from '../assets/soc.svg'
import election_portal from '../assets/election_portal.svg'
import ecert from '../assets/ecert.svg'
import { GoArrowLeft } from "react-icons/go";
import {projects} from './projectData'

export default function Box() {
    return (
        <>
         <div className="h-screen overflow-y-scroll">
         <div className="w-96 h-10 rounded-2xl justify-start items-center gap-3 inline-flex">
  <div className="rounded-full justify-center items-center gap-2.5 flex">
    <div className="p-2 justify-center items-center gap-2.5 flex">
      <div className="w-6 h-6 relative"  >
        <GoArrowLeft size={28}/>
      </div>
    </div>
  </div>
  <div className="w-36 text-zinc-700 text-xl font-semibold font-['Roboto'] leading-7">Projects ({projects.projects.length})</div>
</div>

{
  projects.projects.map((project,index ) => (
  <div className="w-96 h-32 p-4 bg-stone-50 rounded-xl justify-start items-center gap-3 inline-flex" key = {index}>
  <div className="w-24 h-24 relative">
    <div className="w-24 h-24 left-0 top-0 absolute">
      <div className="w-32 h-32 left-[-19.13px] top-[-76.25px] absolute">
        <div className="w-24 h-24 left-[18.21px] top-[19.15px] absolute">
        </div>
      </div>
      <div className="w-20 h-16 left-[7.61px] top-[35.89px] absolute">
      </div>
    </div>
    <div className="w-12 h-12 left-[21.48px] top-[21.96px] absolute">{project.Image_url}
    </div>
  </div>
  <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex"  >
    <div className="self-stretch justify-between items-center inline-flex">
      <div className="grow shrink basis-0 text-zinc-600 text-base font-medium font-['Lato'] leading-normal tracking-tight">{project.Name}</div>
      <div className="w-8 h-8 relative">{project.Url1}</div>
      <div className="w-6 h-6 relative">{project.Url2}</div>
    </div>
    <div className="self-stretch text-zinc-600 text-xs font-medium font-['Lato'] leading-none tracking-tight">{project.Info }</div>
  </div>
</div>
))}



<div className="w-96 h-10 rounded-2xl justify-start items-center gap-3 inline-flex">
  <div className="rounded-full justify-center items-center gap-2.5 flex">
    <div className="p-2 justify-center items-center gap-2.5 flex">
      <div className="w-6 h-6 relative" />
    </div>
  </div>
  <div className="text-zinc-700 text-xl font-semibold font-['Roboto'] leading-7">Events at MDG ({projects.projects.length})</div>
</div>

{projects.projects.map((project, index) => (
  <div key={index}>
  <div className="w-96 h-32 p-4 bg-stone-50 rounded-xl justify-start items-center gap-3 inline-flex" >
    <div className="w-96 h-32 p-4  bg-stone-50 rounded-xl justify-start items-center gap-3 inline-flex ">
  <div className="w-24 h-24 relative ">
    <div className="w-24 h-24 left-0 top-0 absolute ">
      <div className="w-32 h-32 left-[-19.13px] top-[-76.25px] absolute">
        <div className="w-24 h-24 left-[18.21px] top-[19.15px] absolute">
        </div>
      </div>
      <div className="w-20 h-16 left-[7.61px] top-[35.89px] absolute">
      </div>
    </div>
    <div className="w-12 h-12 left-[21.48px] top-[21.96px] absolute">{project.Image_url}
    </div>
  </div>
  <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex" key = {index} >
    <div className="self-stretch justify-between items-center inline-flex">
      <div className="grow shrink basis-0 text-zinc-600 text-base font-medium font-['Lato'] leading-normal tracking-tight">{project.Name}</div>
      <div className="w-8 h-8 relative">{project.Url1}</div>
      <div className="w-6 h-6 relative">{project.Url2}</div>
    </div>
    <div className="self-stretch text-zinc-600 text-xs font-medium font-['Lato'] leading-none tracking-tight">{project.Info }</div>
  </div>
</div>
  </div>
  {index != projects.projects.length - 1 && <div className="h-4" />}
</div>

))}
{/* 
{
  projects.projects.map((project,index ) => (
  <div className="w-96 h-32 p-4  bg-stone-50 rounded-xl justify-start items-center gap-3 inline-flex ">
  <div className="w-24 h-24 relative ">
    <div className="w-24 h-24 left-0 top-0 absolute ">
      <div className="w-32 h-32 left-[-19.13px] top-[-76.25px] absolute">
        <div className="w-24 h-24 left-[18.21px] top-[19.15px] absolute">
        </div>
      </div>
      <div className="w-20 h-16 left-[7.61px] top-[35.89px] absolute">
      </div>
    </div>
    <div className="w-12 h-12 left-[21.48px] top-[21.96px] absolute">{project.Image_url}
    </div>
  </div>
  <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex" key = {index} >
    <div className="self-stretch justify-between items-center inline-flex">
      <div className="grow shrink basis-0 text-zinc-600 text-base font-medium font-['Lato'] leading-normal tracking-tight">{project.Name}</div>
      <div className="w-8 h-8 relative">{project.Url1}</div>
      <div className="w-6 h-6 relative">{project.Url2}</div>
    </div>
    <div className="self-stretch text-zinc-600 text-xs font-medium font-['Lato'] leading-none tracking-tight">{project.Info }</div>
  </div>
</div>
))} */}



<div className="self-stretch h-12 justify-start items-start gap-2 inline-flex">
    <div className="grow shrink basis-0 h-12 bg-blue-500 rounded-full flex-col justify-center items-center gap-2 inline-flex">
      <div className="self-stretch h-96 px-6 py-2.5 justify-center items-center gap-2 inline-flex">
        <div className="text-center text-white text-sm font-medium font-['Roboto'] leading-tight tracking-tight">START NEW CHAT</div>
      </div>
    </div>
    <div className="grow shrink basis-0 h-12 rounded-full border border-blue-500 flex-col justify-center items-center gap-2 inline-flex">
      <div className="self-stretch h-10 px-6 py-2.5 justify-center items-center gap-2 inline-flex">
        <div className="text-center text-blue-500 text-sm font-medium font-['Roboto'] leading-tight tracking-tight">JOIN MDG’s PUBLIC CHAT</div>
      </div>
    </div>
  </div>

         </div>
       

        </>
    );
}
  
        
        
    
    {/*
        <a href={"https://mdgspace.org/project/0"} target="_blank" rel="noopener noreferrer" className="flex justify-center w-full mb-[3vh]">
    <div className="w-[50%] h-auto aspect-square bg-transparent rounded-lg relative">
      <Image src={appetizer} alt="appetizer_logo" layout="fill" objectFit="contain" />
    </div>
    <div className="text-center mt-2">
      <h3 className="text-lg font-bold">Appetizer</h3>
      <p className="text-sm">lpsom</p>
    </div>

  </a>
  <a href={"https://mdgspace.org/project/5"} target="_blank" rel="noopener noreferrer" className="flex justify-center w-full mb-[3vh]">
    <div className="w-[10%] h-auto aspect-square bg-transparent rounded-lg relative">
      <Image src={security_app} alt="security_app_logo" layout="fill" objectFit="contain" />
    </div>
  </a>
  <a href={"https://mdgspace.org/soc"} target="_blank" rel="noopener noreferrer" className="flex justify-center w-full mb-[3vh]">
    <div className="w-[10%] h-auto aspect-square bg-transparent rounded-lg relative">
      <Image src={soc} alt="soc_logo" layout="fill" objectFit="contain" />
    </div>
  </a>
  <a href={"https://election.iitr.ac.in/"} target="_blank" rel="noopener noreferrer" className="flex justify-center w-full mb-[3vh]">
    <div className="w-[10%] h-auto aspect-square bg-transparent rounded-lg relative">
      <Image src={election_portal} alt="ep_logo" layout="fill" objectFit="contain" />
    </div>
  </a>   
  <a href={"https://mdgspace.org/project/3"} target="_blank" rel="noopener noreferrer" className="flex justify-center w-full mb-[3vh]">
    <div className="w-[10%] h-auto aspect-square bg-transparent rounded-lg relative">
      <Image src={ecert} alt="ecert_logo" layout="fill" objectFit="contain" />
    </div>
  </a>   
    */}    
   
       