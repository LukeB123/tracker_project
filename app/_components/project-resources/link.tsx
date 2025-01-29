import { useRouter } from "next/navigation";

import { TProjectDetailsProps } from "@/util/projects";
import { TResourceProps } from "@/util/resources";

import { useAppDispatch } from "@/lib/hooks";
import { projectsActions } from "@/lib/features/project/projectsSlice";
import { resourcesActions } from "@/lib/features/resources/resourcesSlice";

interface ProjectLinkParams {
  project?: TProjectDetailsProps;
  resource?: TResourceProps;
  context: "project" | "resource";
}

export default function ProjectResourceLink({
  project,
  resource,
  context,
}: ProjectLinkParams) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  let hText = "";

  let pText = "";

  let handleClick = () => {};

  if (context === "project" && project) {
    hText = project.title;
    pText = project.last_updated;
    handleClick = () => {
      dispatch(projectsActions.setCurrentProject(project));
      router.push(`/projects/${project.slug}`);
    };
  } else if (context === "resource" && resource) {
    hText = resource.name;
    pText = resource.role;
    handleClick = () => {
      dispatch(resourcesActions.setCurrentResource(resource));
      router.push(`/resources/${resource.slug}`);
    };
  }

  return (
    <button
      onClick={handleClick}
      className="flex justify-between items-center py-1 px-2 mb-2 rounded-md bg-grey-100 hover:bg-grey-200 w-full"
    >
      <h2 className="text-lg font-medium truncate">{hText}</h2>
      <p className="text-md text-grey-700">{pText}</p>
    </button>
  );
}
