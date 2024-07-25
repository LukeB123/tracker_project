import Link from "next/link";

import { useAppDispatch } from "@/lib/hooks";
import { resourcesActions } from "@/lib/resources";
import { useRouter } from "next/navigation";
import { TResourceProps } from "@/util/resources";

interface ResourceLinkParams {
  resource: TResourceProps;
}

export default function ResourceLink({ resource }: ResourceLinkParams) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  function handleClick() {
    dispatch(resourcesActions.setCurrentResource(resource));
    router.push(`/resources/${resource.id}`);
  }

  return (
    <button
      onClick={handleClick}
      className="flex justify-between items-center py-1 px-2 mb-2 rounded-md bg-grey-100 hover:bg-grey-200 w-full"
    >
      <h2 className="text-lg font-medium truncate">{resource.name}</h2>
      <p className="text-md text-grey-700">{resource.role}</p>
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
