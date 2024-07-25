"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import ResourcesTableHeader from "@/app/_components/resources/resources-table-header";
import ResourceLink from "@/app/_components/resources/resource-link";
import AddEntryButton from "@/app/_components/buttons/add-entry-button";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resourcesActions } from "@/lib/resources";
import { TResourceProps } from "@/util/resources";

interface ResourcesParams {
  resources: TResourceProps[];
}

export default function Resources({ resources }: ResourcesParams) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resourcesActions.setAllResources(resources));
    dispatch(resourcesActions.setCurrentResource(null));
  }, []);

  const [search, setSearch] = useState("");

  function handleChange(searchString: string) {
    setSearch(searchString);
  }

  const searchResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(search.toLowerCase())
  );

  const isResourcesEmpty = searchResources.length === 0;

  return (
    <ResourcesTableHeader search={search} handleSearchChange={handleChange}>
      {isResourcesEmpty && (
        <p className="text-center text-purple-700 font-semibold">
          NO RESOURCES FOUND
        </p>
      )}
      {!isResourcesEmpty && (
        <ul className="w-full">
          {searchResources.map((resource) => (
            <li key={resource.id}>
              <ResourceLink resource={resource} />
            </li>
          ))}
        </ul>
      )}
      <Link href="/resources/new-resource-input" className="h-10 w-full">
        <AddEntryButton />
      </Link>
    </ResourcesTableHeader>
  );
}
