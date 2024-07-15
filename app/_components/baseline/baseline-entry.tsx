import Dropdown, { DropdownItem } from "@/app/_components/dropdown";
import DeleteIconButton from "@/app/_components/delete-icon-button";
import React, { useEffect, useState } from "react";
import Icon from "../icons/icons";

interface BaselineEntryProps {
  resources: DropdownItem[];
  weeks: DropdownItem[];
  grades: DropdownItem[];
  entryIndex: number;
  setNumberOfEntries: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function BaselineEntry({
  resources,
  weeks,
  grades,
  entryIndex,
  setNumberOfEntries,
}: BaselineEntryProps) {
  const [isDelete, setIsDelete] = useState(false);
  const [startingWeek, setSetartingWeek] = useState<DropdownItem>({
    id: 0,
    name: "",
  });
  const [numberOfWeeks, setNumberOfWeeks] = useState("");

  function handleWeekChange(id: number) {
    const newWeek = weeks.find((week) => week.id === id)!;

    setSetartingWeek(newWeek);
  }

  function handleNumberOfWeeksChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setNumberOfWeeks(event.target.value);
  }

  const maxNumberOfWeeks = weeks.filter(
    (week) => week.id >= startingWeek.id && week.id !== 0
  ).length;

  useEffect(() => {
    if (isDelete) {
      setNumberOfEntries((prevState) =>
        prevState.filter((entry) => entry !== entryIndex)
      );
    }
  }, [isDelete]);

  return (
    <tr className="relative font-semibold">
      <td>
        {entryIndex > 0 && (
          <div className="absolute -left-5 flex items-center h-full">
            <DeleteIconButton isDelete={isDelete} setIsDelete={setIsDelete} />
          </div>
        )}
        <Dropdown
          id={"resource_" + entryIndex}
          data={resources}
          search={true}
          style="bg-purple-200 rounded-md"
          form="baseline_entries_form"
        />
      </td>
      <td>
        <Dropdown
          id={"rate_grade_" + entryIndex}
          data={grades}
          style="bg-purple-200 rounded-md"
          form="baseline_entries_form"
        />
      </td>
      <td>
        <Dropdown
          id={"week_commencing_" + entryIndex}
          data={weeks}
          parentSelectedItem={startingWeek}
          onSelect={handleWeekChange}
          style="bg-blue-100 rounded-md"
          form="baseline_entries_form"
        />
      </td>
      <td>
        <input
          type="number"
          step="0.5"
          min={0}
          max={5}
          name={"work_days_" + entryIndex}
          form="baseline_entries_form"
          className={"bg-blue-100 w-full rounded-md text-right px-2 py-1"}
          defaultValue={""}
          // value={inputValue}
          // onChange={handleChange}
          // form="time_entries_form"
          // readOnly={!activeWeek || formStatusIsPending}
          // disabled={!isEditing}
        />
      </td>
      <td className="relative">
        <input
          type="number"
          step="1"
          min={1}
          max={maxNumberOfWeeks}
          name={"number_of_weeks_" + entryIndex}
          form="baseline_entries_form"
          value={numberOfWeeks}
          onChange={handleNumberOfWeeksChange}
          className={"bg-blue-100 w-full rounded-md text-right px-2 py-1"}
          // form="time_entries_form"
          // readOnly={!activeWeek || formStatusIsPending}
          // disabled={!isEditing}
        />
        {+numberOfWeeks > maxNumberOfWeeks && (
          <div
            className={
              "group absolute left-2 top-0 h-full w-max flex items-center z-10"
            }
          >
            <Icon
              iconName={"alert"}
              color={"#fe677b"}
              height="15px"
              width="15px"
            />
            <div className="hidden group-hover:block absolute top-5 -left-1 z-10 bg-purple-100 rounded-md border-2 border-purple-300 py-1 px-2 w-max h-fit text-sm text-grey-900 shadow-md">
              <h2 className="pb-1">Exceeds Length of Project</h2>
              <p>Max number of weeks: {maxNumberOfWeeks}</p>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
