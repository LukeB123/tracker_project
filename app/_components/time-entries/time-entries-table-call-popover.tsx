import Link from "next/link";

import {
  TTimeEntriesProps,
  TNewTimeEntriesProps,
} from "@/server/actions/data-fetches";

interface ProjectTimeEntriesTableCellPopoverProps {
  currentProjectTimeEntries: (TTimeEntriesProps | TNewTimeEntriesProps)[];
  otherResourceTimeEntries: (TTimeEntriesProps | TNewTimeEntriesProps)[];
  total_working_days: number;
  resourceAbsenceTimeEntry: number;
}

export default function ProjectTimeEntriesTableCellPopover({
  currentProjectTimeEntries,
  otherResourceTimeEntries,
  total_working_days,
  resourceAbsenceTimeEntry,
}: ProjectTimeEntriesTableCellPopoverProps) {
  const sortedTimeEntryData = otherResourceTimeEntries.toSorted((a, b) =>
    a.project_title > b.project_title ? 1 : -1
  );

  const totalCurrentProjectTimeEntries = currentProjectTimeEntries
    ? currentProjectTimeEntries.reduce(
        (accumulator, project) => accumulator + project.work_days,
        0
      )
    : 0;

  const totalTimeEntryData =
    otherResourceTimeEntries.reduce(
      (accumulator, project) => accumulator + project.work_days,
      0
    ) +
    totalCurrentProjectTimeEntries +
    resourceAbsenceTimeEntry;

  return (
    <div className="hidden group-hover:block absolute left-5 -top-2 z-20 bg-purple-100 rounded-md border-2 border-purple-300 py-1 px-2 w-max h-fit text-sm shadow-md">
      {totalCurrentProjectTimeEntries > 0 && (
        <h1 className="font-semibold border-purple-200 border-b-2 mb-1">
          Current Entry: {totalCurrentProjectTimeEntries}{" "}
          {totalCurrentProjectTimeEntries === 1 ? "Day" : "Days"}
        </h1>
      )}{" "}
      <h2 className="font-semibold">Other Bookings:</h2>
      <ul className="list-inside list-disc text-xs">
        {resourceAbsenceTimeEntry > 0 && (
          <li className="max-w-60 truncate pt-1">
            {resourceAbsenceTimeEntry}{" "}
            {resourceAbsenceTimeEntry === 1 ? "day - " : "days - "}
            <span>Absence</span>
          </li>
        )}
        {sortedTimeEntryData.map((timeEntry) => {
          if (timeEntry.work_days > 0)
            return (
              <li
                key={timeEntry.unique_identifier}
                className="max-w-60 truncate pt-1"
              >
                {timeEntry.work_days}{" "}
                {timeEntry.work_days === 1 ? "day - " : "days - "}
                <span className="text-blue-700 hover:text-blue-500 cursor-pointer">
                  <Link
                    href={"/projects/" + timeEntry.project_slug}
                    target="_blank"
                  >
                    {timeEntry.project_title}
                  </Link>
                </span>
              </li>
            );
        })}
      </ul>
      <p className="font-normal border-purple-200 border-t-2 mt-1">
        TOTAL BOOKED:{" "}
        <span
          className={
            totalTimeEntryData > total_working_days
              ? "text-red-500 font-semibold"
              : "font-semibold"
          }
        >
          {totalTimeEntryData} / {total_working_days}
        </span>
      </p>
    </div>
  );
}
