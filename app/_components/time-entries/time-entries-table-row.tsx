"use client";

import { useEffect, useState } from "react";

import TimeEntriesProjectResourceInput from "@/app/_components/time-entries/time-entries-project-resource-input";
import TimeEntriesTableCell from "@/app/_components/time-entries/time-entries-table-cell";
import { TTableWeeksProps } from "@/app/_components/time-entries/time-entries";

import {
  TResourceProps,
  TRole,
  TProjectDetailsProps,
  TNewTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
  TAbsenceTimeEntriesProps,
} from "@/server/actions/data-fetches";

import { useAppSelector } from "@/app/lib/hooks";

interface TimeEntriesTableRowProps {
  context: "project" | "resource";
  projectResource: TProjectResourcesProps;
  projectResources: TProjectResourcesProps[];
  setProjectResources: React.Dispatch<
    React.SetStateAction<TProjectResourcesProps[]>
  >;
  initialProjectResourcesData: React.MutableRefObject<TProjectResourcesProps[]>;
  timeEntries: (TTimeEntriesProps | TNewTimeEntriesProps)[];
  setTimeEntries: React.Dispatch<
    React.SetStateAction<(TTimeEntriesProps | TNewTimeEntriesProps)[]>
  >;
  absenceTimeEntries: TAbsenceTimeEntriesProps[];
  isEditing: boolean;
  tableWeeks: TTableWeeksProps[];
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
  initialTimeEntriesIsLoading: boolean;
}

export default function TimeEntriesTableRow({
  context,
  projectResource,
  projectResources,
  setProjectResources,
  initialProjectResourcesData,
  timeEntries,
  setTimeEntries,
  absenceTimeEntries,
  isEditing,
  tableWeeks,
  projectResourceSelection,
  isLoading,
  isError,
  changesMade,
  setChangesMade,
  setYearMonthIndex,
  rowTotalType,
  initialTimeEntriesIsLoading,
}: TimeEntriesTableRowProps) {
  const [isDelete, setIsDelete] = useState(false);

  const overAllocationWeeks: TTableWeeksProps[] = [];

  tableWeeks.forEach((week) => {
    const totalTrackerDays = timeEntries
      .filter(
        (entry) =>
          entry.resource_id === projectResource.resource_id &&
          entry.week_commencing === week.week_commencing
      )
      .reduce((accumulator, currentTimeEntry) => {
        return accumulator + currentTimeEntry.work_days;
      }, 0);
    +absenceTimeEntries
      .filter(
        (entry) =>
          entry.resource_id === projectResource.resource_id &&
          entry.week_commencing === week.week_commencing
      )
      .reduce((accumulator, currentTimeEntry) => {
        return accumulator + currentTimeEntry.work_days;
      }, 0);

    if (totalTrackerDays > week.total_working_days && context === "project")
      overAllocationWeeks.push(week);
  });

  // const rowTotal = resourceTimeEntries
  //   .filter((entry) => "unique_identifier" in entry)
  //   .filter((entry) => entry.project_id === projectResource.project_id)
  //   .filter(
  //     (entry) =>
  //       rowTotalType === "allTime" ||
  //       tableWeeks.find(
  //         (week) => week.week_commencing === entry.week_commencing
  //       )?.active
  //   )
  //   .reduce((accumulator, currentValue) => {
  //     return accumulator + currentValue.work_days;
  //   }, 0);

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
      {initialTimeEntriesIsLoading &&
        Array(5)
          .fill(0)
          .map((v, i) => (
            <td key={i} className="animate-pulse">
              <div className="rounded-md bg-grey-100 h-5 lg:h-8"></div>
            </td>
          ))}
      {!initialTimeEntriesIsLoading &&
        projectResource.project_id &&
        projectResource.resource_id &&
        tableWeeks.map((week) => {
          const timeEntry = timeEntries
            .filter((timeEntry) => "unique_identifier" in timeEntry)
            .find(
              (timeEntry) =>
                timeEntry.unique_identifier ===
                projectResource.unique_identifier + "_" + week.week_commencing
            );

          const allResourceTimeEntry = timeEntries.filter(
            (timeEntry) =>
              timeEntry.resource_id === projectResource.resource_id &&
              timeEntry.week_commencing === week.week_commencing
          );

          const resourceAbsenceTimeEntry = absenceTimeEntries
            .filter(
              (timeEntry) =>
                timeEntry.resource_id === projectResource.resource_id &&
                timeEntry.week_commencing === week.week_commencing
            )
            .reduce((accumulator, currentTimeEntry) => {
              return accumulator + currentTimeEntry.work_days;
            }, 0);

          return (
            <td
              key={
                projectResource.unique_identifier + "_" + week.week_commencing
              }
              className={!week.visible ? "hidden" : ""}
            >
              <TimeEntriesTableCell
                context={context}
                isEditing={isEditing}
                isDelete={isDelete}
                projectResource={projectResource}
                week={week}
                timeEntry={timeEntry}
                setTimeEntries={setTimeEntries}
                allResourceTimeEntry={allResourceTimeEntry}
                resourceAbsenceTimeEntry={resourceAbsenceTimeEntry}
                setChangesMade={setChangesMade}
              />
            </td>
          );
        })}
      {/* {projectResource.project_id && projectResource.resource_id && (
        <td className="font-semibold border-l-2 px-1 border-purple-700 text-center">
          {rowTotal}
        </td>
      )} */}
    </tr>
  );
}
