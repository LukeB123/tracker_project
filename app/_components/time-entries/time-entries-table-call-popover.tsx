import { useAppSelector } from "@/lib/hooks";
import { TNewTimeEntriesProps, TTimeEntriesProps } from "@/util/time-entries";
import Link from "next/link";

interface ProjectTimeEntriesTableCellPopoverProps {
  currentProjectTimeEntries:
    | (TTimeEntriesProps | TNewTimeEntriesProps)[]
    | undefined;
  otherResourceTimeEntries: (TTimeEntriesProps | TNewTimeEntriesProps)[];
  total_working_days: number;
}

export default function ProjectTimeEntriesTableCellPopover({
  currentProjectTimeEntries,
  otherResourceTimeEntries,
  total_working_days,
}: ProjectTimeEntriesTableCellPopoverProps) {
  const currentProject = useAppSelector(
    (state) => state.projects.currentProject
  );

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
    ) + totalCurrentProjectTimeEntries;

  return (
    <div className="hidden group-hover:block absolute left-5 -top-2 z-20 bg-purple-100 rounded-md border-2 border-purple-300 py-1 px-2 w-max h-fit text-sm shadow-md">
      <h2 className="font-semibold">Project Bookings:</h2>
      <ul className="list-inside list-disc text-xs">
        {currentProjectTimeEntries && totalCurrentProjectTimeEntries > 0 && (
          <li className="max-w-60 truncate pt-1">
            {totalCurrentProjectTimeEntries}{" "}
            {totalCurrentProjectTimeEntries === 1 ? "day - " : "days - "}
            <span className="font-normal">
              {currentProjectTimeEntries[0].project_title}
            </span>
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
        TOTAL BOOKED: {totalTimeEntryData} / {total_working_days}
      </p>
    </div>
  );
}
