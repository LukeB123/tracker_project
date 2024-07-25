import { Suspense } from "react";

import Projects from "@/app/_components/projects/projects";
import LoadingProjects from "@/app/_components/projects/loading-projects";

import { getProjects } from "@/util/projects";

async function FetchedProjects() {
  try {
    const projects = await getProjects();

    return <Projects projects={projects} />;
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
    <Suspense fallback={<LoadingProjects />}>
      <FetchedProjects />
    </Suspense>
  );
}
