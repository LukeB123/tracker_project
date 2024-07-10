"use client";
import { TWeekProps } from "@/util/date";
import { TPeopleProps } from "@/util/people";
import Dropdown from "@/app/_components/dropdown";
import { useState } from "react";
import BaselineEntry from "./baseline-entry";

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
  const [changesMade, setChangesMade] = useState(false);

  console.log("RENDINGEWRING");

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
  return (
    <>
      <h1>Baseline Input Form</h1>
      <div className="flex lg:justify-center">
        <table className="border-separate border-spacing border-spacing-1">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Grade</th>
              <th>Initial Week</th>
              <th>Days Per Week</th>
              <th>No. Of Weeks</th>
            </tr>
          </thead>
          <tbody>
            {/* <tr>
              <td>
                <Dropdown
                  id={"resource"}
                  data={options}
                  changesMade={changesMade}
                  setChangesMade={setChangesMade}
                  search={true}
                />
              </td>
              <td>
                <Dropdown
                  id={"rate_grade"}
                  data={grades}
                  changesMade={changesMade}
                  setChangesMade={setChangesMade}
                />
              </td>
              <td>
                <Dropdown
                  id="week_commencing"
                  data={weekData}
                  changesMade={changesMade}
                  setChangesMade={setChangesMade}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.5"
                  min={0}
                  max={5}
                  name={"number_of_working_days"}
                  // value={inputValue}
                  // onChange={handleChange}
                  className={"bg-purple-400 w-full"}
                  // form="time_entries_form"
                  // readOnly={!activeWeek || formStatusIsPending}
                  // disabled={!isEditing}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="1"
                  min={0}
                  max={5}
                  name={"number_of_working_days"}
                  // value={inputValue}
                  // onChange={handleChange}
                  className={"bg-purple-400 w-full"}
                  // form="time_entries_form"
                  // readOnly={!activeWeek || formStatusIsPending}
                  // disabled={!isEditing}
                />
              </td>
            </tr> */}
            <BaselineEntry
              options={options}
              weekData={weekData}
              grades={grades}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
            />
            <tr>
              <td>Sarah</td>
              <td>4</td>
              <td>2024-06-29</td>
              <td>2</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Karen</td>
              <td>4</td>
              <td>2024-06-29</td>
              <td>3</td>
              <td>2</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Average age</td>
              <td>33</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
