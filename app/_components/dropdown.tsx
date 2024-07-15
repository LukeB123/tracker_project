"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/app/_components/icons/icons";
import useOutsideClick from "@/app/_hooks/useOutsideClick";
import Image from "next/image";
import SearchBar from "@/app/_components/search-bar";

export interface DropdownItem {
  id: number;
  name: string;
  imageUrl?: string;
}

interface DropdownProps {
  id: string;
  title?: string;
  form?: string;
  data: DropdownItem[];
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  style?: string;
  parentSelectedItem?: DropdownItem;
  onSelect?: (id: number) => void;
  search?: boolean;
  changesMade?: boolean;
  setChangesMade?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  visibledata?: DropdownItem[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function Dropdown({
  id,
  title = "Select",
  form,
  data,
  position = "bottom-left",
  style,
  parentSelectedItem,
  onSelect,
  search = false,
  changesMade,
  setChangesMade,
  disabled = false,
  visibledata,
  isLoading = false,
  isError = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [searchString, setSearchString] = useState("");

  const [selectedItem, setSelectedItem] = useState<DropdownItem | undefined>(
    parentSelectedItem ? { ...parentSelectedItem } : undefined
  );

  let listData = [...data];

  if (visibledata) listData = [...visibledata];

  let searchData = [...listData];

  if (search)
    searchData = listData.filter((entry) =>
      entry.name.toLowerCase().includes(searchString.toLowerCase())
    );

  let dropDownClassName =
    "flex justify-between gap-1 items-center w-full py-1 px-2 ";

  if (style) {
    dropDownClassName += style;
  } else {
    dropDownClassName += "rounded-md bg-blue-500";
  }

  let dropDownMenuClassName =
    "absolute bg-grey-100 w-full min-w-max max-h-52 overflow-y-auto pb-3 rounded-md shadow-md z-10";

  if (position === "bottom-left")
    dropDownMenuClassName += " top-full left-0 mt-1";

  if (position === "bottom-right")
    dropDownMenuClassName += " top-full right-0 mt-1";

  if (position === "top-left")
    dropDownMenuClassName += " bottom-full left-0 mb-1";

  if (position === "top-right")
    dropDownMenuClassName += " bottom-full right-0 mb-1";

  if (!search) dropDownMenuClassName += " pt-3";

  function handleChange(item: DropdownItem) {
    setSelectedItem(item);
    onSelect && onSelect(item.id);
    setIsOpen(false);
    setSearchString("");
    setChangesMade && setChangesMade(true);
  }

  function handleSearchChange(searchStringValue: string) {
    setSearchString(searchStringValue);
  }

  useEffect(() => {
    if (parentSelectedItem && data) {
      const newSelectedItem = data.find(
        (item) => item.id === parentSelectedItem.id
      );
      newSelectedItem && setSelectedItem(newSelectedItem);
    } else {
      setSelectedItem(undefined);
    }
  }, [parentSelectedItem?.id, JSON.stringify(data)]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: dropdownRef,
    handler: () => {
      setIsOpen(false);
      setSearchString("");
    },
  });

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const startingValue = parentSelectedItem
      ? { ...parentSelectedItem }
      : undefined;

    if (
      changesMade !== undefined &&
      !changesMade &&
      startingValue?.id !== selectedItem?.id
    ) {
      setSelectedItem(startingValue);
    }
  }, [changesMade]);

  return (
    <div ref={dropdownRef} className="relative w-full h-full">
      <button
        id={id}
        name={id}
        value={selectedItem?.name}
        aria-label="Toggle-dropdown"
        aria-haspopup="true"
        aria-expanded={isOpen}
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={dropDownClassName}
        aria-required
      >
        {form && (
          <>
            <input
              className="hidden"
              readOnly
              id={id + "_id"}
              name={id + "_id"}
              form={form}
              value={selectedItem ? selectedItem.id : ""}
              onChange={() => {}}
            />
            <input
              className="hidden"
              readOnly
              id={id}
              name={id}
              form={form}
              value={selectedItem ? selectedItem.name : ""}
              onChange={() => {}}
            />
          </>
        )}
        <div className="truncate">{selectedItem?.name || title}</div>
        {!isOpen && (
          <div className="animate-dropDownClosed w-max">
            <Icon
              iconName="downArrow"
              width="20px"
              height="20px"
              color="#5f249f"
            />
          </div>
        )}
        {isOpen && (
          <div className="animate-dropDownOpened w-max">
            <Icon
              iconName="upArrow"
              width="20px"
              height="20px"
              color="#5f249f"
            />
          </div>
        )}
      </button>
      {isOpen && (
        <div aria-label="Dropdown menu" className={dropDownMenuClassName}>
          <ul
            role="menu"
            aria-label={id}
            aria-orientation="vertical"
            className="leading-10"
          >
            {/* {isError && } */}
            {isLoading && (
              <div className="flex justify-center items-center gap-2 cursor-progress pt-2">
                <div className="animate-spin">
                  <Icon
                    iconName="loading"
                    color="#5f249f"
                    height="20px"
                    width="20px"
                  />
                </div>
                <p className="text-purple-700 font-semibold">
                  Fetching Data...
                </p>
              </div>
            )}
            {!isError && !isLoading && (
              <>
                {search && (
                  <div className="sticky top-0 pt-3 bg-grey-100">
                    <SearchBar
                      value={searchString}
                      onChange={handleSearchChange}
                      style="border-b-2 border-purple-500 focus:outline-none bg-grey-100 focus"
                      autoFocus={true}
                    />
                  </div>
                )}
                {searchData?.map((item) => {
                  let activeClass = "";

                  if (selectedItem?.id === item.id)
                    activeClass = " bg-grey-300";

                  return (
                    <li
                      key={item.id}
                      onClick={() => handleChange(item)}
                      className={
                        "flex items-center cursor-pointer hover:bg-grey-200 px-3" +
                        activeClass
                      }
                    >
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt="image" loading="lazy" />
                      )}
                      {item.name}
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
