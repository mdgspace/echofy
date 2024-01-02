import Image from 'next/image';
import appetizer from '../assets/appetizer.svg'
import security_app from '../assets/security_app.svg'
import soc from '../assets/soc.svg'
import election_portal from '../assets/election_portal.svg'
import ecert from '../assets/ecert.svg'

export default function Box() {
    return (
        <>
        <a href={"https://mdgspace.org/project/0"} target="_blank" rel="noopener noreferrer" className="flex justify-center w-full mb-[3vh]">
        <div className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[80%] h-auto aspect-square bg-transparent rounded-lg relative">
                <Image src={appetizer} alt="appetizer_logo" layout="fill" objectFit="contain" />
            </div>
        </a>
        <a href={"https://mdgspace.org/project/5"} target="_blank" rel="noopener noreferrer" className="flex justify-center w-full mb-[3vh]">
        <div className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[80%] h-auto aspect-square bg-transparent rounded-lg relative">
                <Image src={security_app} alt="security_app_logo" layout="fill" objectFit="contain" />
            </div>
        </a>
        <a href={"https://mdgspace.org/soc"} target="_blank" rel="noopener noreferrer" className="flex justify-center w-full mb-[3vh]">
        <div className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[80%] h-auto aspect-square bg-transparent rounded-lg relative">
                <Image src={soc} alt="soc_logo" layout="fill" objectFit="contain" />
            </div>
        </a>
        <a href={"https://election.iitr.ac.in/"} target="_blank" rel="noopener noreferrer" className="flex justify-center w-full mb-[3vh]">
        <div className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[80%] h-auto aspect-square bg-transparent rounded-lg relative">
                <Image src={election_portal} alt="ep_logo" layout="fill" objectFit="contain" />
            </div>
        </a>   
        <a href={"https://mdgspace.org/project/3"} target="_blank" rel="noopener noreferrer" className="flex justify-center w-full mb-[3vh]">
        <div className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[80%] h-auto aspect-square bg-transparent rounded-lg relative">
                <Image src={ecert} alt="ecert_logo" layout="fill" objectFit="contain" />
            </div>
        </a>   
        </>
        
    );
}
