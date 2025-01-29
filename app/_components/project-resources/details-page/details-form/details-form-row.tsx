import Dropdown, { DropdownItem } from "@/app/_components/ui/buttons/dropdown";
import { useFormStatus } from "react-dom";

interface DetailsFormRowParams {
  label: string;
  name: string;
  type: "text" | "number" | "email" | "dropdown";
  value: number | string | undefined;
  dropdownSelection?: DropdownItem[];
  searchableDropdown?: boolean;
  form?: string;
  changesMade?: boolean;
  setChangesMade?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
}

export default function DetailsFormRow({
  label,
  name,
  type,
  value,
  dropdownSelection = [],
  searchableDropdown = false,
  form,
  changesMade,
  setChangesMade,
  isLoading = false,
}: DetailsFormRowParams) {
  const { pending } = useFormStatus();

  let valueClass =
    "basis-1/2 rounded-md bg-grey-50 text-purple-600 border-2 border-grey-600 disabled:text-purple-500 disabled:border-grey-400 px-2 py-1 ";

  let inputElement: JSX.Element;

  if (type === "dropdown") {
    let dropdownValue: DropdownItem | undefined;

    const foundEntry = dropdownSelection.find((entry) => entry.name === value);

    if (dropdownSelection && foundEntry) {
      dropdownValue = {
        ...foundEntry,
      };
    }

    inputElement = (
      <div className="basis-1/2">
        <Dropdown
          id={name}
          title={value ? value.toString() : "Select " + label}
          data={dropdownSelection}
          parentSelectedItem={dropdownValue}
          style="rounded-md bg-grey-50 text-purple-600 border-2 border-grey-600 disabled:border-grey-400 disabled:text-purple-500"
          search={searchableDropdown}
          form={form}
          changesMade={changesMade}
          setChangesMade={setChangesMade}
          isLoading={isLoading}
          disabled={pending}
        />
      </div>
    );
  } else {
    inputElement = (
      <input
        className={valueClass}
        id={name}
        name={name}
        type={type}
        defaultValue={value ? value : ""}
        required
        disabled={pending}
        form={form}
      />
    );
  }

  return (
    <div className="flex justify-between items-center">
      <label htmlFor={name} className="basis-1/2 py-1 pl-2">
        {label}:
      </label>
      {inputElement}
    </div>
  );
}
