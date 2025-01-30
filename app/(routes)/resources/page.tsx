import { Suspense } from "react";

import ProjectResources from "@/app/_components/project-resources/project-resources";
import Loading from "@/app/_components/project-resources/loading";

import { getResourcesFromServer } from "@/server/actions/data-fetches";

async function FetchedResources() {
  try {
    const resources = await getResourcesFromServer();

    return <ProjectResources resources={resources} context="resource" />;
  } catch (error) {
    return (
      <p className="text-center p-2 text-purple-700 font-semibold">
        Error Fetching Resources.
      </p>
    );
  }
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<Loading context="resource" />}>
      <FetchedResources />
    </Suspense>
  );
}
