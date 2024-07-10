import Dropdown, { DropdownItem } from "@/app/_components/dropdown";

interface BaselineEntryProps {
  options: DropdownItem[];
  changesMade: boolean;
  setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
  weekData: DropdownItem[];
  grades: DropdownItem[];
}

export default function BaselineEntry({
  options,
  changesMade,
  setChangesMade,
  weekData,
  grades,
}: BaselineEntryProps) {
  return (
    <tr>
      <td>
        <Dropdown
          id={"resource"}
          data={options}
          changesMade={changesMade}
          setChangesMade={setChangesMade}
          search={true}
        />
      </td>
      <td>
        <Dropdown
          id={"rate_grade"}
          data={grades}
          changesMade={changesMade}
          setChangesMade={setChangesMade}
        />
      </td>
      <td>
        <Dropdown
          id="week_commencing"
          data={weekData}
          changesMade={changesMade}
          setChangesMade={setChangesMade}
        />
      </td>
      <td>
        <input
          type="number"
          step="0.5"
          min={0}
          max={5}
          name={"number_of_working_days"}
          // value={inputValue}
          // onChange={handleChange}
          className={"bg-purple-400 w-full"}
          // form="time_entries_form"
          // readOnly={!activeWeek || formStatusIsPending}
          // disabled={!isEditing}
        />
      </td>
      <td>
        <input
          type="number"
          step="1"
          min={0}
          max={5}
          name={"number_of_working_days"}
          // value={inputValue}
          // onChange={handleChange}
          className={"bg-purple-400 w-full"}
          // form="time_entries_form"
          // readOnly={!activeWeek || formStatusIsPending}
          // disabled={!isEditing}
        />
      </td>
    </tr>
  );
}
