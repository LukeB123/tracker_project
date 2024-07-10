"use client";

import Icon from "@/app/_components/icons/icons";
import { TWeekProps } from "@/util/date";

interface TimeEntriesTableHeaderProps {
  title: string;
  weeks: TWeekProps[];
  visibleWeeks: string[];
  activeWeeks: string[];
}

export default function TimeEntriesTableHeader({
  title,
  weeks,
  visibleWeeks,
  activeWeeks,
}: TimeEntriesTableHeaderProps) {
  return (
    <tr>
      <th className="bg-purple-700 text-grey-50 font-semibold rounded-t-md py-1 px-2 flex">
        <div className="basis-3/4">{title}</div>
        <div className="basis-1/4 ">Grade</div>
      </th>
      {weeks.map((week) => {
        let className = "w-40 min-w-28 font-semibold p-1";

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
            <div className="flex justify-center items-center gap-1">
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
                    <div className="hidden group-hover:block absolute -left-2 -top-14 z-20 bg-purple-100 rounded-md border-2 border-purple-300 py-1 px-2 w-max h-fit text-sm shadow-md">
                      <h2 className="pb-1">Contains Public Holiday(s)</h2>
                      <p className="font-normal">
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
    </tr>
  );
}
