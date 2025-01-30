"use client";

import ArrowButton from "@/app/_components/ui/buttons/arrow-button";
import { TWeekProps } from "@/server/actions/data-fetches";

interface MonthFilterProps {
  weeks: TWeekProps[];
  yearMonthIndex: {
    year: number;
    monthIndex: number;
  };
  handleMonthChange: (type: "decrease" | "increase") => void;
  isDisabled: boolean;
}

export default function MonthFilter({
  weeks,
  yearMonthIndex,
  handleMonthChange,
  isDisabled,
}: MonthFilterProps) {
  const currentMonth = weeks.filter(
    (week) =>
      week.year === yearMonthIndex.year &&
      week.monthIndex === yearMonthIndex.monthIndex
  )[0];

  const leftDisable =
    isDisabled ||
    (currentMonth.year === weeks[0].year &&
      currentMonth.monthIndex === weeks[0].monthIndex);
  const rightDisable =
    isDisabled ||
    (currentMonth.year === weeks.slice(-1)[0].year &&
      currentMonth.monthIndex === weeks.slice(-1)[0].monthIndex);

  return (
    <div className="pt-10 flex justify-between w-1/3 h-24 items-center relative start-1/3">
      <div className="basis-1/8 h-full">
        <ArrowButton
          label="left"
          onClick={() => handleMonthChange("decrease")}
          isDisabled={leftDisable}
        />
      </div>
      <p className="basis-3/4 text-center text-xl">
        {currentMonth.monthYearString}
      </p>
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
