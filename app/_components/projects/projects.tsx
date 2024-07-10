"use client";

import React, { useState } from "react";

import Link from "next/link";

import ProjectsTableHeader from "@/app/_components/projects/projects-table-header";
import ProjectLink from "@/app/_components/projects/project-link";
import AddEntryButton from "@/app/_components/buttons/add-entry-button";

import { TProjectDetailsProps } from "@/util/projects";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { projectsActions } from "@/lib/projects";
import Dropdown from "../dropdown";

interface ProjectsParams {
  projects: TProjectDetailsProps[];
}

export default function Projects({ projects }: ProjectsParams) {
  const dispatch = useAppDispatch();
  dispatch(projectsActions.setAllProjects(projects));
  dispatch(projectsActions.setCurrentProject(null));

  const [search, setSearch] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  const searchProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  const isProjectsEmpty = searchProjects.length === 0;

  return (
    <ProjectsTableHeader search={search} handleSearchChange={handleChange}>
      {isProjectsEmpty && (
        <p className="text-center text-purple-700 font-semibold">
          NO PROJECTS FOUND
        </p>
      )}
      {!isProjectsEmpty && (
        <ul className="w-full">
          {searchProjects.map((project) => (
            <li key={project.id}>
              <ProjectLink project={project} />
            </li>
          ))}
        </ul>
      )}
      <Link href="/projects/new-project-input" className="h-10 w-full">
        <AddEntryButton />
      </Link>
    </ProjectsTableHeader>
  );
}
