import Link from "next/link";

import { TProjectDetailsProps } from "@/util/projects";

import { useAppDispatch } from "@/lib/hooks";
import { projectsActions } from "@/lib/projects";
import { useRouter } from "next/navigation";

interface ProjectLinkParams {
  project: TProjectDetailsProps;
}

export default function ProjectLink({ project }: ProjectLinkParams) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  function handleClick() {
    dispatch(projectsActions.setCurrentProject(project));
    router.push(`/projects/${project.slug}`);
  }

  return (
    <button
      onClick={handleClick}
      className="flex justify-between items-center py-1 px-2 mb-2 rounded-md bg-grey-100 hover:bg-grey-200 w-full"
    >
      <h2 className="text-lg font-medium truncate">{project.title}</h2>
      <p className="text-md text-grey-700">{project.last_updated}</p>
    </button>
    // <Link
    //   className="flex justify-between items-center py-1 px-2 mb-2 rounded-md bg-grey-100 hover:bg-grey-200"
    //   href={`/projects/${project.slug}`}
    // >
    //   <h2 className="text-lg font-medium truncate">{project.title}</h2>
    //   <p className="text-md text-grey-700">{project.last_updated}</p>
    // </Link>
  );
}
