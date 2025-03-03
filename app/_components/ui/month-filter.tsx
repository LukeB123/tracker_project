"use client";

import { TWeekProps } from "@/server/actions/data-fetches";

import ArrowButton from "@/app/_components/ui/buttons/arrow-button";

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
      week.month_index === yearMonthIndex.monthIndex
  )[0];

  const leftDisable =
    isDisabled ||
    (currentMonth.year === weeks[0].year &&
      currentMonth.month_index === weeks[0].month_index);
  const rightDisable =
    isDisabled ||
    (currentMonth.year === weeks.slice(-1)[0].year &&
      currentMonth.month_index === weeks.slice(-1)[0].month_index);

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
        {currentMonth.month_year_string}
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
