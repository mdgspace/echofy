import gh from "../../assets/github.svg";
import ps from "../../assets/Playstore.svg";
import as from "../../assets/Apple_logo_grey.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { ProjectCardProps } from "../../interface/interface";



export const ProjectCard : React.FC<ProjectCardProps> = ({
  name,
  shortDesc,
  ImageLink,
  Github,
  PlayStore,
  AppStore,
}) => {
  const router = useRouter();
  const isGithub = Github != "";
  const isPlaystore = PlayStore != "";
  const isAppStore = AppStore != "";

  const handleClick = () => {
    const extractedText = name;
    router
      .push({
        pathname: "/chat_bot",
        query: { topic: extractedText },
      })
      .then(() => window.location.reload());
  };

  const handleGithub = () => {
    isGithub ? window.open(Github) : null;
  };

  const handlePlaystore = () => {
    isPlaystore ? window.open(PlayStore) : null;
  };

  const handleAppstore = () => {
    isAppStore ? window.open(AppStore) : null;
  };
  return (
    <div className="flex flex-row bg-light-grey rounded-xl py-2">
      <div className="w-1/4 px-2">
        <div className="w-full object-contain aspect-square rounded-lg">
          <img
            src={ImageLink}
            className="rounded-lg w-full"
            alt="Project Image"
          />
        </div>
      </div>
      <div className="w-3/4 content flex flex-col mr-2">
        <div className="header flex flex-row justify-between">
          <div
            className="text-lg hover:cursor-pointer hover:text-customBlue "
            onClick={handleClick}
          >
            {name}
          </div>
          <div className="links">
            <div className="flex flex-row gap-2 mt-2">
              <div className="flex flex-row gap-2">
                <div
                  className={
                    isGithub
                      ? "hover:cursor-pointer w-6 h-6"
                      : "hover:cursor-not-allowed"
                  }
                >
                  <Image
                    src={gh}
                    className="w-6 h-6"
                    onClick={handleGithub}
                    alt="Github"
                  />
                </div>
                <div
                  className={
                    isPlaystore
                      ? "hover:cursor-pointer"
                      : "hover:cursor-not-allowed"
                  }
                >
                  <Image
                    src={ps}
                    className="w-6 h-6"
                    onClick={handlePlaystore}
                    alt="Playstore"
                  />
                </div>
                <div
                  className={
                    isAppStore
                      ? "hover:cursor-pointer"
                      : "hover:cursor-not-allowed"
                  }
                >
                  <Image
                    src={as}
                    className="w-6 h-6"
                    onClick={handleAppstore}
                    alt="Appstore"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-txt-gray">{shortDesc}</div>
      </div>
    </div>
  );
};
export default ProjectCard;