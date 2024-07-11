"use client";

import ArrowButton from "@/app/_components/buttons/arrow-button";
import { TWeekProps } from "@/util/date";

interface MonthFilterProps {
  weeks: TWeekProps[];
  yearMonthIndex: {
    year: number;
    monthIndex: number;
  };
  minYearMonthIndex: {
    year: number;
    monthIndex: number;
  };
  maxYearMonthIndex: {
    year: number;
    monthIndex: number;
  };
  handleMonthChange: (type: "decrease" | "increase") => void;
  isDisabled: boolean;
}

export default function MonthFilter({
  weeks,
  yearMonthIndex,
  minYearMonthIndex,
  maxYearMonthIndex,
  handleMonthChange,
  isDisabled,
}: MonthFilterProps) {
  let leftDisable = isDisabled;
  let rightDisable = isDisabled;

  if (
    yearMonthIndex.year === minYearMonthIndex.year &&
    yearMonthIndex.monthIndex === minYearMonthIndex.monthIndex
  ) {
    leftDisable = true;
  }

  if (
    yearMonthIndex.year === maxYearMonthIndex.year &&
    yearMonthIndex.monthIndex === maxYearMonthIndex.monthIndex
  ) {
    rightDisable = true;
  }

  const displayValue = weeks.filter(
    (week) =>
      week.year === yearMonthIndex.year &&
      week.monthIndex === yearMonthIndex.monthIndex
  )[0].monthYearString;

  return (
    <div className="pt-10 flex justify-between w-1/3 h-24 items-center relative start-1/3">
      <div className="basis-1/8 h-full">
        <ArrowButton
          label="left"
          onClick={() => handleMonthChange("decrease")}
          isDisabled={leftDisable}
        />
      </div>
      <p className="basis-3/4 text-center text-xl">{displayValue}</p>
      <div className="basis-1/8 h-full">
        <ArrowButton
          label="right"
          onClick={() => handleMonthChange("increase")}
          isDisabled={rightDisable}
        />
      </div>
    </div>
  );
}
