import { Suspense } from "react";

import ProjectResources from "@/app/_components/project-resources/project-resources";
import Loading from "@/app/_components/project-resources/loading";

import { getResources } from "@/util/resources";

async function FetchedResources() {
  try {
    const resources = await getResources();

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
