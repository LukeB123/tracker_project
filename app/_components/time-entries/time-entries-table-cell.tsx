import { useEffect, useState } from "react";

import ProjectTimeEntriesTableCellPopover from "@/app/_components/time-entries/time-entries-table-call-popover";
import Icon from "@/app/_components/icons/icons";

import { TTimeEntriesProps } from "@/util/time-entries";
import { TWeekProps } from "@/util/date";
import { useAppSelector } from "@/lib/hooks";

interface TimeEntriesTableCellProps {
  isEditing: boolean;
  uniqueId: string;
  week: TWeekProps;
  total_working_days: number;
  initialTimeEntry: TTimeEntriesProps | undefined;
  otherResourceTimeEntry: TTimeEntriesProps[] | undefined;
  setResourceOverAllocationWeeks: React.Dispatch<
    React.SetStateAction<TWeekProps[]>
  >;
  changesMade: boolean;
  setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
  activeWeek: boolean;
}

export default function TimeEntriesTableCell({
  isEditing,
  uniqueId,
  week,
  total_working_days,
  initialTimeEntry,
  otherResourceTimeEntry,
  setResourceOverAllocationWeeks,
  changesMade,
  setChangesMade,
  activeWeek,
}: TimeEntriesTableCellProps) {
  const [inputValue, setInputValue] = useState(
    initialTimeEntry ? initialTimeEntry.work_days : 0
  );

  const formStatusIsPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  );

  const startingValue = initialTimeEntry ? initialTimeEntry.work_days : 0;

  let totalOtherTimeEntries = otherResourceTimeEntry?.reduce(
    (accumulator, project) => accumulator + project.work_days,
    0
  );

  let className = "text-right px-2 py-1 w-full rounded-md h-8 font-semibold";

  let iconColor = "";

  let isOverAllocated = false;

  if (
    otherResourceTimeEntry &&
    totalOtherTimeEntries !== undefined &&
    inputValue > 0
  ) {
    isOverAllocated = totalOtherTimeEntries + inputValue > total_working_days;
  }

  if (isOverAllocated && activeWeek) {
    if (isEditing) {
      className += " bg-red-200 text-red-800";
      iconColor = "#fe677b";
    } else {
      className += " bg-red-300 text-red-900";
      iconColor = "#fe344f";
    }
  } else if (activeWeek) {
    if (isEditing) {
      className += " bg-blue-100";
      iconColor = "#99d5ff";
      if (inputValue === 0) className += " text-blue-100";
    } else {
      className += " bg-blue-200";
      iconColor = "#66bfff";
      if (inputValue === 0) className += " text-blue-200";
    }
  } else if (!activeWeek) {
    className += " bg-grey-100";
    if (inputValue === 0) {
      className += " text-grey-100";
    } else {
      className += " text-grey-300";
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(+event.target.value);
    setChangesMade(true);
  }

  useEffect(() => {
    if (!changesMade && startingValue !== inputValue) {
      setInputValue(startingValue);
    }
  }, [changesMade]);

  useEffect(() => {
    if (isOverAllocated) {
      setResourceOverAllocationWeeks((prevState) => {
        if (
          !prevState
            .map((week) => week.week_commencing)
            .includes(week.week_commencing)
        )
          return [...prevState, week];

        return prevState;
      });
    } else {
      setResourceOverAllocationWeeks((prevState) => {
        if (
          prevState
            .map((week) => week.week_commencing)
            .includes(week.week_commencing)
        )
          return prevState.filter(
            (overAllocationWeeks) =>
              overAllocationWeeks.week_commencing !== week.week_commencing
          );

        return prevState;
      });
    }
  }, [inputValue, otherResourceTimeEntry]);

  return (
    <div className="relative">
      {activeWeek &&
        otherResourceTimeEntry &&
        totalOtherTimeEntries !== undefined &&
        totalOtherTimeEntries > 0 && (
          <div className="group">
            <div className="absolute left-2 top-2 z-10 cursor-pointer">
              <Icon
                iconName={isOverAllocated ? "alert" : "info"}
                color={iconColor}
                height="15px"
                width="15px"
              />
            </div>
            <ProjectTimeEntriesTableCellPopover
              inputValue={inputValue}
              otherResourceTimeEntry={otherResourceTimeEntry}
              total_working_days={total_working_days}
            />
          </div>
        )}
      {/* <input
        name={uniqueId + "_id"}
        defaultValue={initialTimeEntry?.id}
        className="hidden"
        readOnly
        form="time_entries_form"
      />
      <input
        name={uniqueId + "_changed"}
        value={startingValue === inputValue ? 0 : 1}
        onChange={() => {}}
        className="hidden"
        readOnly
        form="time_entries_form"
      /> */}
      <input
        type="number"
        step="0.5"
        min={0}
        max={total_working_days}
        name={uniqueId}
        value={inputValue}
        onChange={handleChange}
        className={className}
        form="time_entries_form"
        readOnly={!activeWeek || formStatusIsPending}
        disabled={!isEditing}
      />
    </div>
  );
}
