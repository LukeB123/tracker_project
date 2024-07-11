"use client";
import { TWeekProps } from "@/util/date";
import { TPeopleProps } from "@/util/people";
import { useState } from "react";
import BaselineEntry from "./baseline-entry";
import AddEntryButton from "../buttons/add-entry-button";
import BaselineForm from "./baseline-form";

interface BaselineInputProps {
  resources: TPeopleProps[];
  weeks: TWeekProps[];
}

const todayDate = new Date();
const startWeekCommencing = new Date();

const todayDayOfWeek = todayDate.getDay();

const x = (todayDayOfWeek * -1 - 1) % 7;

startWeekCommencing.setDate(todayDate.getDate() + x);

const initialYearMonthIndex = {
  year: startWeekCommencing.getFullYear(),
  monthIndex: startWeekCommencing.getMonth() + 1,
};

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
}: BaselineInputProps) {
  const [numberOfEntries, setNumberOfEntries] = useState([0]);
  console.log("RENDERING");

  //   const selectableWeeks = weeks.filter(week => {
  //     if(week.year === initialYearMonthIndex.year)
  //   })

  const options = resources.map((resource) => {
    return {
      id: resource.id,
      name: resource.name,
    };
  });

  const weekData = weeks.map((week) => {
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

  function handleReset() {}
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
          <tbody>
            {numberOfEntries.map((entry, index) => (
              <BaselineEntry
                key={entry}
                resources={options}
                weeks={[{ id: 0, name: "" }, ...weekData]}
                grades={grades}
                setNumberOfEntries={setNumberOfEntries}
                entryIndex={index}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
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
                  // disabled={formStatusPending}
                >
                  <AddEntryButton isDisabled={false} />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <BaselineForm
        key={numberOfEntries.length}
        numberOfEntries={numberOfEntries.length}
        handleReset={handleReset}
      />
    </>
  );
}
