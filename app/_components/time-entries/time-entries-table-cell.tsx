import { useEffect, useState } from "react";

import ProjectTimeEntriesTableCellPopover from "@/app/_components/time-entries/time-entries-table-call-popover";
import Icon from "@/app/_components/ui/icons";

import {
  TNewProjectResourcesProps,
  TNewTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
} from "@/util/time-entries";
import { TWeekProps } from "@/util/date";
import { useAppSelector } from "@/lib/hooks";

interface TimeEntriesTableCellProps {
  context: "project" | "resource";
  isEditing: boolean;
  isDelete: boolean;
  projectResource: TProjectResourcesProps | TNewProjectResourcesProps;
  week: TWeekProps;
  total_working_days: number;
  timeEntry: TTimeEntriesProps | TNewTimeEntriesProps | undefined;
  setTimeEntries: React.Dispatch<
    React.SetStateAction<(TTimeEntriesProps | TNewTimeEntriesProps)[]>
  >;
  allResourceTimeEntry: (TTimeEntriesProps | TNewTimeEntriesProps)[];
  setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
  activeWeek: boolean;
}

export default function TimeEntriesTableCell({
  context,
  isEditing,
  isDelete,
  projectResource,
  week,
  total_working_days,
  timeEntry,
  setTimeEntries,
  allResourceTimeEntry,
  setChangesMade,
  activeWeek,
}: TimeEntriesTableCellProps) {
  // const [inputValue, setInputValue] = useState(
  //   initialTimeEntry ? initialTimeEntry.work_days : 0
  // );
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
    currentProjectTimeEntries = allResourceTimeEntry?.filter(
      (entry) => entry.project_id === currentProject?.id
    );
    otherResourceTimeEntries = allResourceTimeEntry?.filter(
      (entry) => entry.project_id !== currentProject?.id
    );
  }

  let className =
    "text-center px-2 pl-6 py-1 w-full rounded-md h-full font-semibold";

  let textColor = "";

  let bgColor = "";

  let iconColor = "";

  let isOverAllocated = false;

  if (
    allResourceTimeEntry &&
    currentProjectTimeEntries &&
    currentProjectTimeEntries.length > 0
  ) {
    const totalTimeEntries = allResourceTimeEntry.reduce(
      (accumulator, project) => accumulator + project.work_days,
      0
    );

    isOverAllocated = totalTimeEntries > total_working_days;
  }

  if (isDelete) {
    textColor = " text-grey-300";
    bgColor = " bg-grey-100";
  } else if (isOverAllocated && activeWeek) {
    if (isEditing) {
      textColor = " text-red-800";
      bgColor = " bg-red-200";
      iconColor = "#fe677b";
    } else {
      textColor = " text-red-900";
      bgColor = " bg-red-300";
      iconColor = "#fe344f";
    }
  } else if (activeWeek) {
    if (isEditing) {
      bgColor = " bg-blue-100";
      iconColor = "#99d5ff";
    } else {
      bgColor = " bg-blue-200";
      iconColor = "#66bfff";
    }
  } else if (!activeWeek) {
    bgColor = " bg-grey-100";
    textColor = " text-grey-300";
  }

  className += bgColor + textColor;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newWorkingDaysValue = +event.target.value;

    const newTimeEntry: TTimeEntriesProps | TNewTimeEntriesProps = {
      project_id: projectResource.project_id!,
      project_slug: projectResource.project_slug,
      project_title: projectResource.project_title,
      resource_id: projectResource.resource_id!,
      role_id: projectResource.role_id!,
      rate_grade: projectResource.rate_grade,
      week_commencing: week.week_commencing,
      work_days: newWorkingDaysValue,
      unique_identifier:
        projectResource.unique_identifier + "_" + week.week_commencing,
    };

    setTimeEntries((prevState) => {
      if (timeEntry) {
        const timeEntryIndex = prevState.findIndex(
          (entry) => entry.unique_identifier === timeEntry.unique_identifier
        );

        if ("id" in timeEntry) {
          return [
            ...prevState.slice(0, timeEntryIndex),
            { ...newTimeEntry, id: timeEntry.id },
            ...prevState.slice(timeEntryIndex + 1),
          ];
        }

        if (newWorkingDaysValue > 0) {
          return [
            ...prevState.slice(0, timeEntryIndex),
            newTimeEntry,
            ...prevState.slice(timeEntryIndex + 1),
          ];
        }
      }

      if (newWorkingDaysValue > 0) {
        return [...prevState, newTimeEntry];
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
    <div className="relative">
      {activeWeek &&
        !isDelete &&
        ((otherResourceTimeEntries && otherResourceTimeEntries.length > 0) ||
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
              total_working_days={total_working_days}
            />
          </div>
        )}
      <input
        type="number"
        step="0.5"
        min={0}
        max={total_working_days}
        name={projectResource.unique_identifier}
        value={inputValue}
        onChange={handleChange}
        className={className}
        form="time_entries_form"
        readOnly={!activeWeek || formStatusIsPending}
        disabled={!isEditing || isDelete}
      />
    </div>
  );
}
