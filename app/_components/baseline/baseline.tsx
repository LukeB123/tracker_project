"use client";
import { TWeekProps } from "@/util/date";
import { TResourceProps, TRole } from "@/util/resources";
import { useState } from "react";
import BaselineEntry from "@/app/_components/baseline/baseline-entry";
import AddEntryButton from "@/app/_components/ui/buttons/add-entry-button";
import BaselineForm from "@/app/_components/baseline/baseline-form";
import { useAppSelector } from "@/lib/hooks";

interface BaselineInputProps {
  resources: TResourceProps[];
  weeks: TWeekProps[];
  roles: TRole[];
}

// const todayDate = new Date();
// const startWeekCommencing = new Date();

// const todayDayOfWeek = todayDate.getDay();

// const x = (todayDayOfWeek * -1 - 1) % 7;

// startWeekCommencing.setDate(todayDate.getDate() + x);

// const initialYearMonthIndex = {
//   year: startWeekCommencing.getFullYear(),
//   monthIndex: startWeekCommencing.getMonth() + 1,
// };

const grades = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
  { id: 7, name: "7" },
];

export default function BaselineInput({
  resources,
  weeks,
  roles,
}: BaselineInputProps) {
  const [numberOfEntries, setNumberOfEntries] = useState([0]);
  const [tableBodyKey, setTableBodyKey] = useState(0);

  const formStatusIsPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  )!;

  const resourceOptions = resources.map((resource) => {
    return {
      id: resource.id,
      name: resource.name,
    };
  });

  const weekOptions = weeks.map((week) => {
    let monthIndexString = week.monthIndex.toString();
    if (week.monthIndex < 10) monthIndexString = "0" + monthIndexString;
    return {
      id: +(
        week.year.toString() +
        monthIndexString +
        week.weekIndex.toString()
      ),
      name: week.week_commencing,
    };
  });

  function handleSuccess() {
    setNumberOfEntries([0]);
    setTableBodyKey((prevState) => prevState + 1);
  }

  return (
    <>
      <h1 className="text-center mt-10 text-xl font-semibold">
        Baseline Quick Entry Input Form
      </h1>
      <div className="flex lg:justify-center my-5">
        <table className="border-separate border-spacing border-spacing-1">
          <thead>
            <tr>
              <th className="min-w-40 font-medium border-b-2 border-purple-600 px-2 py-1">
                Resource
              </th>
              <th className="min-w-40 font-medium border-b-2 border-purple-600 px-2 py-1">
                Role
              </th>
              <th className="min-w-28 font-medium border-b-2 border-purple-600 px-2 py-1">
                Grade
              </th>
              <th className="min-w-40 font-medium border-b-2 border-blue-500 px-2 py-1">
                Initial Week
              </th>
              <th className="min-w-40 font-medium border-b-2 border-blue-500 px-2 py-1">
                Days Per Week
              </th>
              <th className="min-w-40 font-medium border-b-2 border-blue-500 px-2 py-1">
                No. Of Weeks
              </th>
            </tr>
          </thead>
          <tbody key={tableBodyKey}>
            {numberOfEntries.map((entry) => (
              <BaselineEntry
                key={entry}
                resources={resourceOptions}
                roles={roles}
                weeks={[{ id: 0, name: "" }, ...weekOptions]}
                grades={grades}
                setNumberOfEntries={setNumberOfEntries}
                entryIndex={entry}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                <button
                  type="button"
                  className="w-full h-8"
                  onClick={() => {
                    setNumberOfEntries((prevValue) => {
                      return [
                        ...prevValue,
                        prevValue[prevValue.length - 1] + 1,
                      ];
                    });
                  }}
                  disabled={formStatusIsPending}
                >
                  <AddEntryButton isDisabled={formStatusIsPending} />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <BaselineForm
        key={numberOfEntries.length}
        numberOfEntries={numberOfEntries}
        handleSuccess={handleSuccess}
        weeks={weeks}
      />
    </>
  );
}
