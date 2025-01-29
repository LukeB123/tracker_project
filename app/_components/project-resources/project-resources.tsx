"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import TableHeader from "@/app/_components/project-resources/table-header";
import ProjectResourceLink from "@/app/_components/project-resources/link";
import AddEntryButton from "@/app/_components/ui/buttons/add-entry-button";

import { TProjectDetailsProps } from "@/util/projects";
import { TResourceProps } from "@/util/resources";

import { useAppDispatch } from "@/lib/hooks";
import { projectsActions } from "@/lib/features/project/projectsSlice";
import { resourcesActions } from "@/lib/features/resources/resourcesSlice";

interface ProjectResourcesParams {
  projects?: TProjectDetailsProps[];
  resources?: TResourceProps[];
  context: "project" | "resource";
}

export default function ProjectResources({
  projects,
  resources,
  context,
}: ProjectResourcesParams) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (context === "project" && projects) {
      dispatch(projectsActions.setAllProjects(projects));
      dispatch(projectsActions.setCurrentProject(null));
    } else if (context === "resource" && resources) {
      dispatch(resourcesActions.setAllResources(resources));
      dispatch(resourcesActions.setCurrentResource(null));
    }
  }, []);

  const [search, setSearch] = useState("");

  function handleChange(searchString: string) {
    setSearch(searchString);
  }

  const searchProjects = projects?.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  const searchResources = resources?.filter((resource) =>
    resource.name.toLowerCase().includes(search.toLowerCase())
  );

  let isEmpty = true;

  let href = "";

  if (context === "project" && projects) {
    href = "/projects/new-project-input";

    isEmpty = searchProjects!.length === 0;
  } else if (context === "resource" && resources) {
    href = "/resources/new-resource-input";

    isEmpty = searchResources!.length === 0;
  }

  return (
    <TableHeader
      search={search}
      handleSearchChange={handleChange}
      context={context}
    >
      {isEmpty && (
        <p className="text-center text-purple-700 font-semibold">
          NO {context === "project" ? "PROJECTS:" : "RESOURCES:"} FOUND
        </p>
      )}
      {context === "project" && !isEmpty && (
        <ul className="w-full">
          {searchProjects!.map((project) => (
            <li key={project.id}>
              <ProjectResourceLink project={project} context={context} />
            </li>
          ))}
        </ul>
      )}
      {context === "resource" && !isEmpty && (
        <ul className="w-full">
          {searchResources!.map((resource) => (
            <li key={resource.id}>
              <ProjectResourceLink resource={resource} context={context} />
            </li>
          ))}
        </ul>
      )}
      <Link href={href} className="h-10 w-full">
        <AddEntryButton />
      </Link>
    </TableHeader>
  );
}
