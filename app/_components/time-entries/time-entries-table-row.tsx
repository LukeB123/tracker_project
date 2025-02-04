"use client";

import { useEffect, useState } from "react";

import TimeEntriesProjectResourceInput from "@/app/_components/time-entries/time-entries-project-resource-input";
import TimeEntriesTableCell from "@/app/_components/time-entries/time-entries-table-cell";

import {
  TWeekProps,
  TResourceProps,
  TRole,
  TProjectDetailsProps,
  TNewProjectResourcesProps,
  TNewTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
} from "@/server/actions/data-fetches";

import { useAppSelector } from "@/app/lib/hooks";

interface TimeEntriesTableRowProps {
  context: "project" | "resource";
  projectResource: TProjectResourcesProps | TNewProjectResourcesProps;
  projectResources: (TProjectResourcesProps | TNewProjectResourcesProps)[];
  setProjectResources: React.Dispatch<
    React.SetStateAction<(TProjectResourcesProps | TNewProjectResourcesProps)[]>
  >;
  initialTimeEntriesIsLoading: boolean;
  initialProjectResourcesData: React.MutableRefObject<TProjectResourcesProps[]>;
  timeEntries: (TTimeEntriesProps | TNewTimeEntriesProps)[];
  setTimeEntries: React.Dispatch<
    React.SetStateAction<(TTimeEntriesProps | TNewTimeEntriesProps)[]>
  >;
  isEditing: boolean;
  weeks: TWeekProps[];
  visibleWeeks: string[];
  activeWeeks: string[];
  projectResourceSelection:
    | {
        projects: TProjectDetailsProps[];
        resources: TResourceProps[];
        roles: TRole[];
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
  rowTotalType: "monthly" | "allTime";
}

export default function TimeEntriesTableRow({
  context,
  projectResource,
  projectResources,
  setProjectResources,
  initialTimeEntriesIsLoading,
  initialProjectResourcesData,
  timeEntries,
  setTimeEntries,
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
  rowTotalType,
}: TimeEntriesTableRowProps) {
  const formStatusIsPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  );
  const [isDelete, setIsDelete] = useState(false);

  const overAllocationWeeks: TWeekProps[] = [];

  const resourceTimeEntries = timeEntries.filter(
    (entry) => entry.resource_id === projectResource.resource_id
  );

  let rowTotal = 0;

  weeks.forEach((week) => {
    const totalTrackerDays = resourceTimeEntries
      .filter((entry) => entry.week_commencing === week.week_commencing)
      .map((entry) => entry.work_days)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    if (totalTrackerDays > week.total_working_days && context === "project")
      overAllocationWeeks.push(week);

    let rowTimeEntry: number | undefined;

    if (rowTotalType === "monthly") {
      rowTimeEntry = timeEntries.find(
        (entry) =>
          entry.unique_identifier ===
            projectResource.unique_identifier + "_" + week.week_commencing &&
          activeWeeks.includes(week.week_commencing)
      )?.work_days;
    } else {
      rowTimeEntry = timeEntries.find(
        (entry) =>
          entry.unique_identifier ===
          projectResource.unique_identifier + "_" + week.week_commencing
      )?.work_days;
    }

    if (rowTimeEntry) rowTotal += rowTimeEntry;
  });

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
          : "relative"
      }
    >
      <TimeEntriesProjectResourceInput
        context={context}
        projectResource={projectResource}
        projectResources={projectResources}
        setProjectResources={setProjectResources}
        initialProjectResourcesData={initialProjectResourcesData}
        setTimeEntries={setTimeEntries}
        resourceOverAllocationWeeks={overAllocationWeeks}
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
        projectResource.project_id &&
        projectResource.resource_id &&
        weeks.map((week) => {
          const timeEntry = timeEntries.find(
            (timeEntry) =>
              timeEntry.unique_identifier ===
              projectResource.unique_identifier + "_" + week.week_commencing
          );

          const allResourceTimeEntry = timeEntries.filter(
            (timeEntry) =>
              timeEntry.resource_id === projectResource.resource_id &&
              timeEntry.week_commencing === week.week_commencing
          );

          return (
            <td
              key={
                projectResource.unique_identifier + "_" + week.week_commencing
              }
              className={
                !visibleWeeks.includes(week.week_commencing) ? "hidden" : ""
              }
            >
              <TimeEntriesTableCell
                context={context}
                isEditing={isEditing}
                isDelete={isDelete}
                projectResource={projectResource}
                week={week}
                total_working_days={week.total_working_days}
                timeEntry={timeEntry}
                allResourceTimeEntry={allResourceTimeEntry}
                setTimeEntries={setTimeEntries}
                setChangesMade={setChangesMade}
                activeWeek={activeWeeks.includes(week.week_commencing)}
              />
            </td>
          );
        })}
      {!initialTimeEntriesIsLoading &&
        projectResource.project_id &&
        projectResource.resource_id && (
          <td className="font-semibold border-l-2 px-1 border-purple-700 text-center">
            {rowTotal}
          </td>
        )}
      {initialTimeEntriesIsLoading &&
        Array(5)
          .fill(0)
          .map((v, i) => (
            <td key={i} className="animate-pulse">
              <div className="rounded-md bg-grey-100 h-5 lg:h-8"></div>
            </td>
          ))}
    </tr>
  );
}
