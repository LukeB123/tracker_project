import Dropdown, { DropdownItem } from "@/app/_components/dropdown";
import { useFormStatus } from "react-dom";

interface ProjectDetailsFormRowParams {
  label: string;
  name: string;
  type: "text" | "number" | "dropdown";
  value: DropdownItem | number | string | undefined;
  selection?: DropdownItem[];
  disabledmessage?: string;
  search?: boolean;
  form?: string;
  changesMade?: boolean;
  setChangesMade?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
}

export default function ProjectDetailsFormRow({
  label,
  name,
  type,
  value,
  selection = [],
  disabledmessage = "",
  search = false,
  form,
  changesMade,
  setChangesMade,
  isLoading = false,
}: ProjectDetailsFormRowParams) {
  const { pending } = useFormStatus();

  let valueClass =
    "basis-1/2 rounded-md px-2 bg-grey-50 text-purple-600 border-2 border-grey-600 disabled:text-purple-500 px-2 py-1 ";

  if (disabledmessage != "") valueClass += " italic";

  let inputElement: JSX.Element;

  if (
    typeof value === "number" ||
    typeof value === "string" ||
    value === undefined
  ) {
    inputElement = (
      <input
        className={valueClass}
        id={name}
        name={name}
        type={type}
        defaultValue={value ? value : ""}
        required
        disabled={pending || disabledmessage != ""}
        form={form}
      />
    );
  } else {
    inputElement = (
      <div className="basis-1/2">
        <Dropdown
          id={name}
          title={value ? value.name.toString() : "Select " + label}
          data={selection}
          parentSelectedItem={value}
          style="rounded-md bg-grey-50 text-purple-600 border-2 border-grey-600"
          search={search}
          form={form}
          changesMade={changesMade}
          setChangesMade={setChangesMade}
          isLoading={isLoading}
        />
      </div>
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
