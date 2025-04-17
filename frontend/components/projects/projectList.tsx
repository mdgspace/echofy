import { ProjectListProps } from "../../interface/interface";
import { ProjectCard } from "./projectCard";


export const ProjectList : React.FC<ProjectListProps> = ({ projects, category, heightDecrease }) => {
  return (
    <div className="">
      <div className="font-Roboto text-gray-secondary font-semibold">
        {category} ({projects.length})
      </div>
      <div
        className={`flex flex-col gap-2 rounded-xl font-Lato overflow-y-auto ${!heightDecrease ? "h-[40vh]" : "h-[44vh]"}`}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            name={project.Name}
            shortDesc={project.ShortDesc}
            ImageLink={project.ImageLink}
            Github={project.GithubLink}
            PlayStore={project.PlayStoreLink}
            AppStore={project.AppStoreLink}
          />
        ))}
      </div>
    </div>
  );
};
export default ProjectList;