import Dropdown, { DropdownItem } from "@/app/_components/ui/buttons/dropdown";
import DeleteIconButton from "@/app/_components/ui/buttons/delete-icon-button";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/app/lib/hooks";

interface BaselineEntryProps {
  resources: DropdownItem[];
  entryIndex: number;
  setNumberOfEntries: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function AbsenceEntry({
  resources,
  entryIndex,
  setNumberOfEntries,
}: BaselineEntryProps) {
  const [isDelete, setIsDelete] = useState(false);
  const [startOfLeave, setStartOfLeave] = useState("");
  const [endOfLeave, setEndOfLeave] = useState("");

  const formStatusIsPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  )!;

  function handleStartOfLeaveChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setStartOfLeave(event.target.value);
    if (endOfLeave === "" || event.target.value > endOfLeave) {
      setEndOfLeave(event.target.value);
    }
  }

  function handleEndOfLeaveChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEndOfLeave(event.target.value);
  }

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
            <DeleteIconButton
              isDelete={isDelete}
              setIsDelete={setIsDelete}
              isDisabled={formStatusIsPending}
            />
          </div>
        )}
        <Dropdown
          id={"resource_" + entryIndex}
          form="absence_entries_form"
          data={resources}
          style="bg-purple-200 rounded-md"
          search={true}
          disabled={formStatusIsPending}
        />
      </td>
      <td>
        <Dropdown
          id={"approver_" + entryIndex}
          form="absence_entries_form"
          data={resources}
          style="bg-purple-200 rounded-md"
          search={true}
          disabled={formStatusIsPending}
        />
      </td>
      <td>
        <Dropdown
          id={"absence_type_" + entryIndex}
          form="absence_entries_form"
          data={[
            { id: 1, name: "Annual Leave" },
            { id: 2, name: "Sick Leave" },
            { id: 3, name: "New Parent Leave" },
            { id: 4, name: "Compassionate Leave" },
            { id: 5, name: "Training" },
            { id: 6, name: "TOIL" },
            { id: 7, name: "Other" },
          ]}
          style="bg-purple-200 rounded-md"
          disabled={formStatusIsPending}
        />
      </td>
      <td>
        <Dropdown
          id={"absence_duration_" + entryIndex}
          form="absence_entries_form"
          data={[
            { id: 1, name: "Half Day" },
            { id: 2, name: "Full Day" },
          ]}
          style="bg-purple-200 rounded-md"
          disabled={formStatusIsPending}
        />
      </td>
      <td>
        <input
          type="date"
          form="absence_entries_form"
          name={"start_of_absence_" + entryIndex}
          value={startOfLeave}
          onChange={handleStartOfLeaveChange}
          className={"bg-blue-100 w-full rounded-md text-right px-2 py-1"}
          disabled={formStatusIsPending}
        />
      </td>
      <td className="relative">
        <input
          type="date"
          form="absence_entries_form"
          name={"end_of_absence_" + entryIndex}
          value={endOfLeave}
          onChange={handleEndOfLeaveChange}
          min={startOfLeave}
          className={"bg-blue-100 w-full rounded-md text-right px-2 py-1"}
          disabled={formStatusIsPending}
        />
      </td>
    </tr>
  );
}
