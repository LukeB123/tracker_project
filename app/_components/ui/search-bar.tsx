import Icon from "@/app/_components/ui/icons";
import React from "react";

interface SearchBarParams {
  label?: string;
  value: string;
  onChange?: (searchString: string) => void;
  disabled?: boolean;
  style?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  label,
  value,
  onChange,
  disabled = false,
  style,
  autoFocus = false,
}: SearchBarParams) {
  let className =
    "h-full w-full border-2 rounded-md border-purple-500 pr-2 pl-8 focus:outline-none";

  if (style) className = style + " h-full w-full pr-2 pl-8";

  let disabledLabel = "Loading...";
  let notDisabledLabel = "Search...";

  if (label) {
    disabledLabel = `${label} loading...`;
    notDisabledLabel = `Search ${label}...`;
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange && onChange(event.target.value);
  }

  return (
    <div className="flex justify-start items-center h-full w-full relative">
      {onChange && (
        <input
          type="text"
          placeholder={disabled ? disabledLabel : notDisabledLabel}
          className={className}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          autoFocus={autoFocus}
        />
      )}
      {!onChange && (
        <input
          type="text"
          placeholder={disabled ? disabledLabel : notDisabledLabel}
          className={className}
          disabled={disabled}
          autoFocus={autoFocus}
        />
      )}
      <div className="h-1/2 aspect-square absolute left-2">
        <Icon iconName="search" color="#a46ede" />
      </div>
    </div>
  );
}
