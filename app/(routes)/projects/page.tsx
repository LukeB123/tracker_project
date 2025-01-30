import { Suspense } from "react";

import { getProjectsFromServer } from "@/server/actions/data-fetches";

import ProjectResources from "@/app/_components/project-resources/project-resources";
import Loading from "@/app/_components/project-resources/loading";

async function FetchedProjects() {
  try {
    const projects = await getProjectsFromServer();

    // return <Projects projects={projects} />;
    return <ProjectResources projects={projects} context="project" />;
  } catch (error) {
    return (
      <p className="text-center p-2 text-purple-700 font-semibold">
        Error Fetching Projects.
      </p>
    );
  }
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<Loading context="project" />}>
      <FetchedProjects />
    </Suspense>
  );
}
