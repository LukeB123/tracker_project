import ProjectsTableHeader from "@/app/_components/projects/projects-table-header";
import Icon from "@/app/_components/icons/icons";

export default function LoadingProjects() {
  return (
    <>
      <ProjectsTableHeader disableSearchBar>
        <div className="mt-1 flex justify-center items-center gap-2">
          <div className="animate-spin">
            <Icon
              iconName="loading"
              color="#5f249f"
              height="20px"
              width="20px"
            />
          </div>
          <p className="text-purple-700 font-semibold">Fetching Projects...</p>
        </div>
      </ProjectsTableHeader>
    </>
  );
}
