"use client";

import Icon from "@/app/_components/ui/icons";
import { TWeekProps } from "@/server/util/date";

interface TimeEntriesTableHeaderProps {
  title: string;
  weeks: TWeekProps[];
  visibleWeeks: string[];
  activeWeeks: string[];
  rowTotalType: "monthly" | "allTime" | undefined;
  setRowTotalType: React.Dispatch<React.SetStateAction<"monthly" | "allTime">>;
}

export default function TimeEntriesTableHeader({
  title,
  weeks,
  visibleWeeks,
  activeWeeks,
  rowTotalType,
  setRowTotalType,
}: TimeEntriesTableHeaderProps) {
  return (
    <tr>
      <th className="bg-purple-700 text-grey-50 font-semibold rounded-tl-md py-1 px-2">
        {title}
      </th>
      <th className="bg-purple-700 text-grey-50 font-semibold py-1 px-2">
        Role
      </th>
      <th className="bg-purple-700 text-grey-50 font-semibold rounded-tr-md py-1 px-2">
        Grade
      </th>
      {weeks.map((week) => {
        let className = "w-40 min-w-24 font-semibold p-1";

        if (!visibleWeeks.includes(week.week_commencing)) {
          className += " hidden";
        } else {
          if (activeWeeks.includes(week.week_commencing)) {
            className += " text-purple-700";
          } else {
            className += " text-grey-300";
          }
        }

        return (
          <th key={week.week_commencing} className={className}>
            <div className="flex justify-center items-center lg:gap-1">
              {week.total_working_days < 5 &&
                activeWeeks.includes(week.week_commencing) && (
                  <div className="group relative text-left">
                    <div className="cursor-pointer">
                      <Icon
                        iconName="info"
                        color="#66bfff"
                        height="15px"
                        width="15px"
                      />
                    </div>
                    <div className="hidden group-hover:block absolute -left-2 -top-14 z-20 bg-purple-100 rounded-md border-2 border-purple-300 py-1 px-2 w-max h-fit lg:text-sm shadow-md">
                      <h2 className="pb-1">Contains Public Holiday(s)</h2>
                      <p className="lg:font-normal">
                        Total working days:{" "}
                        <span className="font-semibold">
                          {week.total_working_days}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              <p>{week.week_commencing}</p>
            </div>
          </th>
        );
      })}
      {rowTotalType && (
        <th className="font-semibold border-l-2 px-1 border-purple-700 text-center">
          <button
            onClick={() => {
              setRowTotalType((prevState) =>
                prevState === "monthly" ? "allTime" : "monthly"
              );
            }}
          >
            {rowTotalType === "monthly" ? "Monthly " : "All-Time "}Total
          </button>
        </th>
      )}
    </tr>
  );
}
