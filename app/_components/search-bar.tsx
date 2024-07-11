import Icon from "@/app/_components/icons/icons";
import React from "react";

interface SearchBarParams {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

  return (
    <div className="flex justify-start items-center h-full w-full relative">
      <input
        type="text"
        placeholder={disabled ? disabledLabel : notDisabledLabel}
        className={className}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoFocus={autoFocus}
      />
      <div className="h-1/2 aspect-square absolute left-2">
        <Icon iconName="search" color="#a46ede" />
      </div>
    </div>
  );
}
