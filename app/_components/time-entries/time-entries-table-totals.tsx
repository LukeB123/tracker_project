import {
  TAbsenceTimeEntriesProps,
  TNewTimeEntriesProps,
  TTimeEntriesProps,
} from "@/server/actions/data-fetches";
import Icon from "@/app/_components/ui/icons";
import { useAppSelector } from "@/app/lib/hooks";
import { TTableWeeksProps } from "@/app/_components/time-entries/time-entries";

interface TimeEntriesTableTotalsProps {
  context: "project" | "resource";
  timeEntries: (TTimeEntriesProps | TNewTimeEntriesProps)[];
  absenceTimeEntries: TAbsenceTimeEntriesProps[];
  tableWeeks: TTableWeeksProps[];
  setYearMonthIndex: React.Dispatch<
    React.SetStateAction<{
      year: number;
      monthIndex: number;
    }>
  >;
  rowTotalType: "monthly" | "allTime";
}

type TResourceOverAllocationMonths = {
  monthYearString: string;
  monthIndex: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  year: number;
};

export default function TimeEntriesTableTotals({
  context,
  timeEntries,
  tableWeeks,
  absenceTimeEntries,
  setYearMonthIndex,
  rowTotalType,
}: TimeEntriesTableTotalsProps) {
  const currentProject = useAppSelector(
    (state) => state.projects.currentProject
  );

  const weekTotals: {
    week: string;
    total_time_entries: number;
    total_working_days: number;
    active: boolean;
    visible: boolean;
  }[] = [];

  let resourceOverAllocationMonths: TResourceOverAllocationMonths[] = [];

  tableWeeks.map((week) => {
    let totalTimeEntry = 0;

    if (context === "project") {
      totalTimeEntry = timeEntries
        .filter((timeEntry) => "unique_identifier" in timeEntry)
        .filter(
          (timeEntry) =>
            timeEntry.week_commencing === week.week_commencing &&
            timeEntry.project_id === currentProject?.id
        )
        .reduce(
          (accumulator, currentEntry) => accumulator + currentEntry.work_days,
          0
        );
    } else if (context === "resource") {
      totalTimeEntry =
        timeEntries
          .filter(
            (timeEntry) => timeEntry.week_commencing === week.week_commencing
          )
          .reduce(
            (accumulator, currentEntry) => accumulator + currentEntry.work_days,
            0
          ) +
        absenceTimeEntries
          .filter(
            (timeEntry) => timeEntry.week_commencing === week.week_commencing
          )
          .reduce(
            (accumulator, currentEntry) => accumulator + currentEntry.work_days,
            0
          );

      if (totalTimeEntry > week.total_working_days)
        resourceOverAllocationMonths.push({
          monthYearString: week.month_year_string,
          monthIndex: week.month_index,
          year: week.year,
        });
    }

    weekTotals.push({
      week: week.week_commencing,
      total_time_entries: totalTimeEntry,
      total_working_days: week.total_working_days,
      active: week.active,
      visible: week.visible,
    });
  });

  resourceOverAllocationMonths = resourceOverAllocationMonths.filter(
    (month, index, array) =>
      array.findIndex(
        (element) => element.monthYearString === month.monthYearString
      ) === index
  );

  //   let totalTotal = 0;

  //   if (rowTotalType === "allTime") {
  //     totalTotal = weekTotals.reduce(
  //       (accumulator, currentEntry) =>
  //         accumulator + currentEntry.total_time_entries,
  //       0
  //     );
  //   }

  //   if (rowTotalType === "allTime") {
  //     const activeTotals = weekTotals.filter((week) =>
  //       activeWeeks.includes(week.week)
  //     );

  //     totalTotal = activeTotals.reduce(
  //       (accumulator, currentEntry) =>
  //         accumulator + currentEntry.total_time_entries,
  //       0
  //     );
  //   }

  return (
    <tr>
      <td
        colSpan={3}
        className="font-semibold border-t-2 border-b-2 border-purple-700 text-purple-700"
      >
        <div
          className={
            resourceOverAllocationMonths.length > 0
              ? "relative flex items-center pl-6"
              : "relative flex items-center"
          }
        >
          Totals:
          {resourceOverAllocationMonths.length > 0 && (
            <div
              className={"group absolute left-1 h-full w-max flex items-center"}
            >
              <Icon
                iconName={"alert"}
                color={"#fe344f"}
                height="15px"
                width="15px"
              />
              <div className="hidden group-hover:block absolute top-5 -left-1 z-10 bg-blue-100 rounded-md border-2 border-blue-300 py-1 px-2 w-max h-fit text-sm text-grey-900 shadow-md">
                <h2 className="pb-1">Resource Over Allocated in Month(s):</h2>
                <ul className="list-inside list-disc">
                  {resourceOverAllocationMonths.map((month) => (
                    <li key={month.monthYearString}>
                      <button
                        onClick={() =>
                          setYearMonthIndex({
                            year: month.year,
                            monthIndex: month.monthIndex,
                          })
                        }
                      >
                        {month.monthYearString}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </td>
      {weekTotals.map((week) => {
        let className = "text-center font-semibold border-t-2 border-b-2";

        if (
          context === "resource" &&
          week.total_time_entries > week.total_working_days
        ) {
          className += " text-red-600";
        } else if (!week.active) {
          className += " text-grey-300";
        } else {
          className += " text-purple-700";
        }

        if (!week.active) {
          className += " border-grey-300";
        } else {
          className += " border-purple-700";
        }

        return (
          <td key={week.week} className={!week.visible ? "hidden" : className}>
            {week.total_time_entries}
          </td>
        );
      })}
      {/* <td className="text-center font-semibold border-t-2 border-b-2 border-purple-700">
        {totalTotal}
      </td> */}
    </tr>
  );
}
