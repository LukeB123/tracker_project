"use client";

import { useEffect, useRef, useState } from "react";

import TimeEntriesProjectResourceInput from "@/app/_components/time-entries/time-entries-project-resource-input";
import TimeEntriesTableCell from "@/app/_components/time-entries/time-entries-table-cell";

import {
  TNewProjectResourcesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
} from "@/util/time-entries";
import { TPeopleProps } from "@/util/people";
import { TProjectDetailsProps } from "@/util/projects";
import { TWeekProps } from "@/util/date";

interface TimeEntriesTableRowProps {
  context: "project" | "resource";
  projectResourceIndex: number;
  projectResource: TProjectResourcesProps | TNewProjectResourcesProps;
  projectResources: (TProjectResourcesProps | TNewProjectResourcesProps)[];
  setProjectResources: React.Dispatch<
    React.SetStateAction<(TProjectResourcesProps | TNewProjectResourcesProps)[]>
  >;
  initialProjectResourcesData: React.MutableRefObject<TProjectResourcesProps[]>;
  initialTimeEntriesIsLoading: boolean;
  timeEntries: TTimeEntriesProps[];
  isEditing: boolean;
  weeks: TWeekProps[];
  visibleWeeks: string[];
  activeWeeks: string[];
  projectResourceSelection:
    | {
        projects: TProjectDetailsProps[];
        resources: TPeopleProps[];
      }
    | undefined;
  isLoading: boolean;
  isError: boolean;
  changesMade: boolean;
  setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
  setYearMonthIndex: React.Dispatch<
    React.SetStateAction<{
      year: number;
      monthIndex: number;
    }>
  >;
}

export default function TimeEntriesTableRow({
  context,
  projectResourceIndex,
  projectResource,
  projectResources,
  setProjectResources,
  initialProjectResourcesData,
  initialTimeEntriesIsLoading,
  timeEntries,
  isEditing,
  weeks,
  visibleWeeks,
  activeWeeks,
  projectResourceSelection,
  isLoading,
  isError,
  changesMade,
  setChangesMade,
  setYearMonthIndex,
}: TimeEntriesTableRowProps) {
  const [isDelete, setIsDelete] = useState(false);

  const [resourceOverAllocationWeeks, setResourceOverAllocationWeeks] =
    useState<TWeekProps[]>([]);

  let initialProjectResourceTimeEntries: TTimeEntriesProps[] = [];

  if ("id" in projectResource) {
    const initialProjectResource = initialProjectResourcesData.current.find(
      (initialProjectResource) =>
        initialProjectResource.id === projectResource.id
    );

    if (initialProjectResource) {
      initialProjectResourceTimeEntries = timeEntries.filter(
        (timeEntry) =>
          timeEntry.resource_id === initialProjectResource.resource_id &&
          timeEntry.project_id === initialProjectResource.project_id
      );
    }
  }

  useEffect(() => {
    if (!changesMade) {
      if (isDelete) setIsDelete(false);
    }
  }, [changesMade]);

  return (
    <tr
      className={
        isDelete &&
        (projectResource.project_title === "" ||
          projectResource.resource_name === "")
          ? "hidden"
          : undefined
      }
    >
      <TimeEntriesProjectResourceInput
        context={context}
        projectResourceIndex={projectResourceIndex}
        projectResource={projectResource}
        projectResources={projectResources}
        setProjectResources={setProjectResources}
        resourceOverAllocationWeeks={resourceOverAllocationWeeks}
        projectResourceSelection={projectResourceSelection}
        isEditing={isEditing}
        isLoading={isLoading}
        isError={isError}
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        changesMade={changesMade}
        setChangesMade={setChangesMade}
        setYearMonthIndex={setYearMonthIndex}
      />
      {!initialTimeEntriesIsLoading &&
        weeks.map((week) => {
          const initialTimeEntry = initialProjectResourceTimeEntries.find(
            (timeEntry) => timeEntry.week_commencing === week.week_commencing
          );

          const otherResourceTimeEntry = timeEntries?.filter(
            (timeEntry) =>
              timeEntry.resource_id === projectResource.resource_id &&
              timeEntry.week_commencing === week.week_commencing &&
              timeEntry.project_id !== projectResource.project_id
          );

          return (
            <td
              key={
                projectResource.unique_identifier + "_" + week.week_commencing
              }
              className={
                !visibleWeeks.includes(week.week_commencing) || isDelete
                  ? "hidden"
                  : ""
              }
            >
              <TimeEntriesTableCell
                isEditing={isEditing}
                uniqueId={
                  projectResource.unique_identifier + "_" + week.week_commencing
                }
                week={week}
                total_working_days={week.total_working_days}
                initialTimeEntry={initialTimeEntry}
                otherResourceTimeEntry={
                  context === "project" ? otherResourceTimeEntry : undefined
                }
                setResourceOverAllocationWeeks={setResourceOverAllocationWeeks}
                changesMade={changesMade}
                setChangesMade={setChangesMade}
                activeWeek={activeWeeks.includes(week.week_commencing)}
              />
            </td>
          );
        })}
      {initialTimeEntriesIsLoading &&
        Array(5)
          .fill(0)
          .map((v, i) => (
            <td key={i} className="animate-pulse">
              <div className="rounded-md bg-grey-100 h-8"></div>
            </td>
          ))}
    </tr>
  );
}
