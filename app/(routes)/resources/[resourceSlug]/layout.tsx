"use client";

import NavButton from "@/app/_components/buttons/nav-button";
import Icon from "@/app/_components/icons/icons";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resourcesActions } from "@/lib/resources";
import { getResource, getResourceFromSlug } from "@/util/resources";
import { useEffect, useState } from "react";

interface ResourceDetailsPageParams {
  params: { resourceSlug: string };
  children: React.ReactNode;
}

export default function ProjectsLayout({
  params,
  children,
}: ResourceDetailsPageParams) {
  const dispatch = useAppDispatch();

  const resource = useAppSelector((state) => state.resources.currentResource);

  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchResource() {
      if (!resource) {
        try {
          const responce = await getResourceFromSlug(params.resourceSlug);

          dispatch(resourcesActions.setCurrentResource(responce));
          setError(false);
        } catch (error) {
          setError(true);
        }
      }
    }

    fetchResource();
  }, []);

  const path = "/resources/" + params.resourceSlug;

  return (
    <>
      {!resource && !error && (
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
            Loading Resource Details...
          </p>
        </div>
      )}
      {!resource && error && (
        <p className="mt-10 text-center p-2 text-purple-700 font-semibold">
          Error Fetching Resource Details.
        </p>
      )}
      {resource && !error && (
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
            {/* <NavButton
              href="/baseline-requirements"
              path={path}
              label="Baseline Requirements"
            /> */}
          </div>
          <div className="h-16" />
          {children}
        </>
      )}
    </>
  );
}
