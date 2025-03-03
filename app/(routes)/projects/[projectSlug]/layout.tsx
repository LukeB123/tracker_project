"use client";

import { useEffect, useState } from "react";

import { getProjectFromSlugFromServer } from "@/server/actions/data-fetches";

import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { projectsActions } from "@/app/lib/features/project/projectsSlice";

import NavButton from "@/app/_components/ui/buttons/nav-button";
import Icon from "@/app/_components/ui/icons";

interface ProjectDetailsPageParams {
  params: { projectSlug: string };
  children: React.ReactNode;
}

export default function ProjectsLayout({
  params,
  children,
}: ProjectDetailsPageParams) {
  const dispatch = useAppDispatch();

  const project = useAppSelector((state) => state.projects.currentProject);

  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!project) {
        try {
          const responce = await getProjectFromSlugFromServer(
            params.projectSlug
          );

          dispatch(projectsActions.setCurrentProject(responce));
          setError(false);
        } catch (error) {
          setError(true);
        }
      }
    }

    fetchProject();
  }, []);

  const path = "/projects/" + params.projectSlug;

  return (
    <>
      {!project && !error && (
        <div className="mt-5 flex justify-center items-center gap-2">
          <div className="animate-spin">
            <Icon
              iconName="loading"
              color="#5f249f"
              height="20px"
              width="20px"
            />
          </div>
          <p className="text-purple-700 font-semibold">
            Loading Project Details...
          </p>
        </div>
      )}
      {!project && error && (
        <p className="mt-10 text-center p-2 text-purple-700 font-semibold">
          Error Fetching Project Details.
        </p>
      )}
      {project && !error && (
        <>
          <div className="fixed w-full flex justify-center gap-4 pt-2 pb-4	font-dxc z-20 bg-white ">
            <NavButton href="/time-entry" path={path} label="Resource Time" />
            {/* <NavButton
              href="/revenue-milestones"
              path={path}
              label="Revenue Milestones"
            />
            <NavButton
              href="/hardware-software"
              path={path}
              label="Hardware & Software"
            /> */}
            <NavButton
              href="/baseline-requirements"
              path={path}
              label="Baseline Requirements"
            />
          </div>
          <div className="h-16" />
          {children}
        </>
      )}
    </>
  );
}
