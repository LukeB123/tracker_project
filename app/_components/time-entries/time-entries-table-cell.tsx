import { useEffect, useState } from "react";

import ProjectTimeEntriesTableCellPopover from "@/app/_components/time-entries/time-entries-table-call-popover";
import { TTableWeeksProps } from "@/app/_components/time-entries/time-entries";
import Icon from "@/app/_components/ui/icons";

import {
  TNewTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
} from "@/server/actions/data-fetches";

import { useAppSelector } from "@/app/lib/hooks";

interface TimeEntriesTableCellProps {
  context: "project" | "resource";
  isEditing: boolean;
  isDelete: boolean;
  projectResource: TProjectResourcesProps;
  week: TTableWeeksProps;
  timeEntry: TTimeEntriesProps | TNewTimeEntriesProps | undefined;
  setTimeEntries: React.Dispatch<
    React.SetStateAction<(TTimeEntriesProps | TNewTimeEntriesProps)[]>
  >;
  allResourceTimeEntry: (TTimeEntriesProps | TNewTimeEntriesProps)[];
  resourceAbsenceTimeEntry: number;
  setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TimeEntriesTableCell({
  context,
  isEditing,
  isDelete,
  projectResource,
  week,
  timeEntry,
  setTimeEntries,
  allResourceTimeEntry,
  resourceAbsenceTimeEntry,
  setChangesMade,
}: TimeEntriesTableCellProps) {
  const currentProject = useAppSelector(
    (state) => state.projects.currentProject
  );

  const formStatusIsPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  );

  const inputValue: number | "" = timeEntry ? timeEntry.work_days : "";

  let currentProjectTimeEntries: (TTimeEntriesProps | TNewTimeEntriesProps)[] =
    [];

  let otherResourceTimeEntries: (TTimeEntriesProps | TNewTimeEntriesProps)[] =
    [];

  if (context === "project") {
    currentProjectTimeEntries = allResourceTimeEntry.filter(
      (entry) => entry.project_id === currentProject?.id
    );

    otherResourceTimeEntries = allResourceTimeEntry.filter(
      (entry) => entry.project_id !== currentProject?.id
    );
  }

  let cellClass =
    "text-center px-2 pl-6 py-1 w-full rounded-md h-full font-semibold";

  let textColor = "";

  let bgColor = "";

  let iconColor = "";

  let isOverAllocated = false;

  if (currentProjectTimeEntries.length > 0) {
    const totalTimeEntries =
      allResourceTimeEntry.reduce(
        (accumulator, project) => accumulator + project.work_days,
        0
      ) + resourceAbsenceTimeEntry;

    isOverAllocated = totalTimeEntries > week.total_working_days;
  }

  if (isDelete) {
    textColor = " text-grey-300";
    bgColor = " bg-grey-100";
  } else if (isOverAllocated && week.active) {
    if (isEditing) {
      textColor = " text-red-800";
      bgColor = " bg-red-200";
      iconColor = "#fe677b";
    } else {
      textColor = " text-red-900";
      bgColor = " bg-red-300";
      iconColor = "#fe344f";
    }
  } else if (week.active) {
    if (isEditing) {
      bgColor = " bg-blue-100";
      iconColor = "#99d5ff";
    } else {
      bgColor = " bg-blue-200";
      iconColor = "#66bfff";
    }
  } else if (!week.active) {
    bgColor = " bg-grey-100";
    textColor = " text-grey-300";
  }

  cellClass += bgColor + textColor;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newWorkingDaysValue = +event.target.value;

    setTimeEntries((prevState) => {
      if (!timeEntry && newWorkingDaysValue > 0) {
        const newTimeEntry: TNewTimeEntriesProps = {
          project_id: projectResource.project_id,
          project_slug: projectResource.project_slug,
          project_title: projectResource.project_title,
          resource_id: projectResource.resource_id,
          resource_name: projectResource.resource_name,
          resource_slug: projectResource.resource_slug,
          role_id: projectResource.role_id,
          role: projectResource.role,
          rate_grade: projectResource.rate_grade,
          week_commencing: week.week_commencing,
          work_days: newWorkingDaysValue,
          unique_identifier:
            projectResource.unique_identifier + "_" + week.week_commencing,
        };

        return [...prevState, newTimeEntry];
      }

      if (timeEntry && newWorkingDaysValue > 0) {
        const timeEntryIndex = prevState.findIndex(
          (entry) => entry.unique_identifier === timeEntry.unique_identifier
        );

        return [
          ...prevState.slice(0, timeEntryIndex),
          { ...timeEntry, work_days: newWorkingDaysValue },
          ...prevState.slice(timeEntryIndex + 1),
        ];
      }

      if (timeEntry && "id" in timeEntry && newWorkingDaysValue === 0) {
        const timeEntryIndex = prevState.findIndex(
          (entry) => entry.unique_identifier === timeEntry.unique_identifier
        );

        return [
          ...prevState.slice(0, timeEntryIndex),
          { ...timeEntry, work_days: 0 },
          ...prevState.slice(timeEntryIndex + 1),
        ];
      }

      return prevState.filter(
        (entry) =>
          entry.unique_identifier !==
          projectResource.unique_identifier + "_" + week.week_commencing
      );
    });

    setChangesMade(true);
  }

  return (
    <div className={"relative"}>
      {week.active &&
        !isDelete &&
        (otherResourceTimeEntries.length > 0 ||
          (resourceAbsenceTimeEntry > 0 && context === "project") ||
          isOverAllocated) && (
          <div className="group">
            <div className="absolute left-2 top-1 lg:top-2 z-10 cursor-pointer">
              <Icon
                iconName={isOverAllocated ? "alert" : "info"}
                color={iconColor}
                height="15px"
                width="15px"
              />
            </div>
            <ProjectTimeEntriesTableCellPopover
              currentProjectTimeEntries={currentProjectTimeEntries}
              otherResourceTimeEntries={otherResourceTimeEntries}
              total_working_days={week.total_working_days}
              resourceAbsenceTimeEntry={resourceAbsenceTimeEntry}
            />
          </div>
        )}
      <input
        type="number"
        step="0.5"
        min={0}
        max={week.total_working_days}
        name={projectResource.unique_identifier}
        value={inputValue}
        onChange={handleChange}
        className={cellClass}
        form="time_entries_form"
        readOnly={!week.active || formStatusIsPending}
        disabled={!isEditing || isDelete}
      />
    </div>
  );
}
