import  { ProjectCard }  from "./projectCard"


export const ProjectList = ({ projects, category }) => {

    return (
        <div className="">
            <div class="font-Roboto text-gray-secondary font-semibold">
                {category} ({projects.length})
            </div>
            <div class="flex flex-col gap-2 rounded-xl font-Lato h-[48vh] overflow-y-auto">
                {projects.map((project) => (
                    <ProjectCard name={project.Name} shortDesc={project.ShortDesc} ImageLink={project.ImageLink} Github={project.GithubLink} PlayStore={project.PlayStoreLink} AppStore={project.AppStoreLink} />
                ))}
            </div>
        </div>
    )
}

export default ProjectList