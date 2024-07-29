"use client";

import { useEffect, useRef, useState } from "react";

import MonthFilter from "@/app/_components/month-filter/month-filter";
import TimeEntriesTableHeader from "@/app/_components/time-entries/time-entries-table-header";
import TimeEntriesTableRow from "@/app/_components/time-entries/time-entries-table-row";
import AddEntryButton from "@/app/_components/buttons/add-entry-button";
import TimeEntriesForm from "@/app/_components/time-entries/time-entries-form";
import Icon from "@/app/_components/icons/icons";

import {
  TNewProjectResourcesProps,
  TNewTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
} from "@/util/time-entries";
import { TWeekProps } from "@/util/date";
import {
  TResourceProps,
  TRole,
  getResources,
  getRoles,
} from "@/util/resources";
import { TProjectDetailsProps, getProjects } from "@/util/projects";

import { useAppSelector } from "@/lib/hooks";

interface TimeEntriesProps {
  context: "project" | "resource";
  initialProjectResources: TProjectResourcesProps[];
  weeks: TWeekProps[];
  initialTimeEntries: TTimeEntriesProps[];
  initialTimeEntriesIsLoading: boolean;
}

type TResourceOverAllocationMonths = {
  monthYearString: string;
  monthIndex: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  year: number;
};

export default function TimeEntries({
  context,
  initialProjectResources,
  weeks,
  initialTimeEntries,
  initialTimeEntriesIsLoading,
}: TimeEntriesProps) {
  const [projectResources, setProjectResources] = useState<
    (TProjectResourcesProps | TNewProjectResourcesProps)[]
  >(JSON.parse(JSON.stringify(initialProjectResources)));

  const [timeEntries, setTimeEntries] = useState<
    (TTimeEntriesProps | TNewTimeEntriesProps)[]
  >(JSON.parse(JSON.stringify(initialTimeEntries)));

  const [formKey, setFormKey] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [projectResourceSelection, setProjectResourceSelection] = useState<
    | {
        projects: TProjectDetailsProps[];
        resources: TResourceProps[];
        roles: TRole[];
      }
    | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [yearMonthIndex, setYearMonthIndex] = useState(
    setInitialYearMonthIndex
  );

  const [rowTotalType, setRowTotalType] = useState<"monthly" | "allTime">(
    "monthly"
  );

  const currentProject = useAppSelector(
    (state) => state.projects.currentProject
  );

  const currentResource = useAppSelector(
    (state) => state.resources.currentResource
  );

  const formStatusPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  );

  const initialProjectResourcesData: React.MutableRefObject<
    TProjectResourcesProps[]
  > = useRef(initialProjectResources);

  const initialTimeEntriesData: React.MutableRefObject<TTimeEntriesProps[]> =
    useRef(initialTimeEntries);

  function setInitialYearMonthIndex() {
    const todayDate = new Date();

    let initialYearMonthIndex = {
      year: todayDate.getFullYear(),
      monthIndex: todayDate.getMonth() + 1,
    };

    const isCurrentProject =
      weeks.filter(
        (week) =>
          week.monthIndex === initialYearMonthIndex.monthIndex &&
          week.year === initialYearMonthIndex.year
      ).length > 0;

    if (!isCurrentProject)
      initialYearMonthIndex = {
        year: weeks[0].year,
        monthIndex: weeks[0].monthIndex,
      };

    return initialYearMonthIndex;
  }

  function handleReset() {
    setChangesMade(false);
    setProjectResources(initialProjectResourcesData.current);
    setTimeEntries(initialTimeEntriesData.current);
  }

  function handleCancelEdit() {
    if (changesMade) {
      handleReset();
    }

    setIsEditing(false);
  }

  function handleAddProjectResource(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    // event.preventDefault();

    const projectResourceAdded =
      projectResources.length - initialProjectResourcesData.current.length;

    let newProjectResource: TNewProjectResourcesProps;

    if (context === "project" && currentProject) {
      newProjectResource = {
        project_id: currentProject.id,
        project_slug: currentProject.slug,
        project_title: currentProject.title,
        resource_id: undefined,
        resource_name: "",
        resource_slug: "",
        role_id: undefined,
        role: "",
        rate_grade: "",
        unique_identifier: "newProjectResource_" + (projectResourceAdded + 1),
      };

      setProjectResources((prevState) => {
        return [...prevState, newProjectResource];
      });
    }

    if (context === "resource" && currentResource) {
      newProjectResource = {
        project_id: undefined,
        project_slug: "",
        project_title: "",
        resource_id: currentResource.id,
        resource_name: currentResource.name,
        resource_slug: currentResource.slug,
        role_id: currentResource.role_id,
        role: currentResource.role,
        rate_grade: currentResource.grade,
        unique_identifier: "newProjectResource_" + (projectResourceAdded + 1),
      };

      setProjectResources((prevState) => {
        return [...prevState, newProjectResource];
      });
    }

    setChangesMade(true);
  }

  function handleMonthChange(type: "increase" | "decrease") {
    if (type === "increase") {
      setYearMonthIndex((prevValue) => {
        if (prevValue.monthIndex < 12)
          return { ...prevValue, monthIndex: prevValue.monthIndex + 1 };
        return { monthIndex: 1, year: prevValue.year + 1 };
      });
    } else if (type === "decrease") {
      setYearMonthIndex((prevValue) => {
        if (prevValue.monthIndex > 1)
          return { ...prevValue, monthIndex: prevValue.monthIndex - 1 };
        return { monthIndex: 12, year: prevValue.year - 1 };
      });
    }
  }

  const activeWeeks = weeks
    .filter(
      (week) =>
        week.monthIndex === yearMonthIndex.monthIndex &&
        week.year === yearMonthIndex.year
    )
    .map((week) => week.week_commencing);

  const visibleWeeks = [...activeWeeks];

  if (
    visibleWeeks.length < 5 &&
    (yearMonthIndex.year < weeks.slice(-1)[0].year ||
      yearMonthIndex.monthIndex < weeks.slice(-1)[0].monthIndex)
  ) {
    let nextMonthWeeks: TWeekProps[];

    if (yearMonthIndex.monthIndex < 12) {
      nextMonthWeeks = weeks.filter(
        (week) =>
          week.monthIndex === yearMonthIndex.monthIndex + 1 &&
          week.year === yearMonthIndex.year
      );
    } else {
      nextMonthWeeks = weeks.filter(
        (week) => week.monthIndex === 1 && week.year === yearMonthIndex.year + 1
      );
    }

    const nextWeek = nextMonthWeeks.find(
      (week) => week.weekIndex === 1
    )?.week_commencing;

    if (nextWeek) visibleWeeks.push(nextWeek);
  }

  useEffect(() => {
    setFormKey(Math.random());
  }, [projectResources, timeEntries]);

  // Fetch all resources if a new resource is added ONCE for project context
  useEffect(() => {
    async function fetchSelection() {
      if (!projectResourceSelection && isEditing) {
        setIsLoading(true);
        setIsError(false);

        try {
          const roles = await getRoles();

          if (context === "project") {
            const response = await getResources();

            setProjectResourceSelection({
              projects: [],
              resources: response,
              roles,
            });
          }
          if (context === "resource") {
            const response = await getProjects();

            setProjectResourceSelection({
              projects: response,
              resources: [],
              roles,
            });
          }
        } catch (error) {
          setIsError(true);
        }

        setIsLoading(false);
      }
    }

    fetchSelection();
  }, [context, isEditing]);

  const weekTotals: { week: string; total: number; max: number }[] = [];

  const overAllocationWeeks: TWeekProps[] = [];

  {
    weeks.map((week) => {
      let totalTimeEntry = 0;

      if (context === "project") {
        totalTimeEntry = timeEntries
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
        totalTimeEntry = timeEntries
          .filter(
            (timeEntry) => timeEntry.week_commencing === week.week_commencing
          )
          .reduce(
            (accumulator, currentEntry) => accumulator + currentEntry.work_days,
            0
          );

        if (totalTimeEntry > week.total_working_days)
          overAllocationWeeks.push(week);
      }

      weekTotals.push({
        week: week.week_commencing,
        total: totalTimeEntry,
        max: week.total_working_days,
      });
    });
  }

  const resourceOverAllocationMonths: TResourceOverAllocationMonths[] =
    overAllocationWeeks
      .map((week) => {
        return {
          monthYearString: week.monthYearString,
          monthIndex: week.monthIndex,
          year: week.year,
        };
      })
      .filter(
        (month, index, array) =>
          array.findIndex(
            (element) => element.monthIndex === month.monthIndex
          ) === index
      );

  return (
    <>
      <MonthFilter
        weeks={weeks}
        yearMonthIndex={yearMonthIndex}
        handleMonthChange={handleMonthChange}
        isDisabled={initialTimeEntriesIsLoading}
      />
      <div className="flex lg:justify-center text-xs lg:text-base">
        <table className="my-4 mx-8 border-separate border-spacing border-spacing-y-1">
          <thead>
            <TimeEntriesTableHeader
              title={context === "project" ? "Resource" : "Project"}
              weeks={weeks}
              visibleWeeks={visibleWeeks}
              activeWeeks={activeWeeks}
              rowTotalType={
                projectResources.length > 0 ? rowTotalType : undefined
              }
              setRowTotalType={setRowTotalType}
            />
          </thead>
          <tbody>
            {!(projectResources.length > 0) && !isEditing && (
              <tr>
                <td colSpan={3} className="">
                  <p className="px-2 py-1 text-center text-purple-700 font-semibold bg-grey-200 border-2 rounded-md">
                    {context === "project"
                      ? "No resources have been assigned"
                      : "No projects have been assigned"}
                  </p>
                </td>
              </tr>
            )}
            {projectResources.map((projectResource, index) => {
              return (
                <TimeEntriesTableRow
                  key={projectResource.unique_identifier}
                  context={context}
                  projectResource={projectResource}
                  projectResources={projectResources}
                  setProjectResources={setProjectResources}
                  initialProjectResourcesData={initialProjectResourcesData}
                  initialTimeEntriesIsLoading={initialTimeEntriesIsLoading}
                  timeEntries={timeEntries}
                  setTimeEntries={setTimeEntries}
                  isEditing={isEditing}
                  weeks={weeks}
                  visibleWeeks={visibleWeeks}
                  activeWeeks={activeWeeks}
                  projectResourceSelection={projectResourceSelection}
                  isLoading={isLoading}
                  isError={isError}
                  changesMade={changesMade}
                  setChangesMade={setChangesMade}
                  setYearMonthIndex={setYearMonthIndex}
                  rowTotalType={rowTotalType}
                />
              );
            })}
          </tbody>
          <tfoot>
            {isEditing && (
              <tr>
                <td colSpan={3}>
                  <button
                    type="button"
                    className="w-full h-6 lg:h-8"
                    onClick={handleAddProjectResource}
                    disabled={formStatusPending}
                  >
                    <AddEntryButton isDisabled={formStatusPending} />
                  </button>
                </td>
              </tr>
            )}
            {!initialTimeEntriesIsLoading && projectResources.length > 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="font-semibold border-t-2 border-b-2 border-purple-700"
                >
                  <div
                    className={
                      overAllocationWeeks.length > 0
                        ? "relative flex items-center pl-6"
                        : "relative flex items-center"
                    }
                  >
                    Totals:
                    {overAllocationWeeks.length > 0 && (
                      <div
                        className={
                          "group absolute left-1 h-full w-max flex items-center"
                        }
                      >
                        <Icon
                          iconName={"alert"}
                          color={"#fe677b"}
                          height="15px"
                          width="15px"
                        />
                        <div className="hidden group-hover:block absolute top-5 -left-1 z-10 bg-blue-100 rounded-md border-2 border-blue-300 py-1 px-2 w-max h-fit text-sm text-grey-900 shadow-md">
                          <h2 className="pb-1">
                            Resource Over Allocated in Month(s):
                          </h2>
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
                  let className =
                    "text-center font-semibold border-t-2 border-b-2 border-purple-700";

                  if (week.total > week.max && context === "resource")
                    className += " text-red-500";
                  return (
                    <td
                      key={week.week}
                      className={
                        !visibleWeeks.includes(week.week) ? "hidden" : className
                      }
                    >
                      {week.total}
                    </td>
                  );
                })}
              </tr>
            )}
          </tfoot>
        </table>
      </div>
      <TimeEntriesForm
        key={formKey}
        context={context}
        projectResources={projectResources}
        initialProjectResourcesData={initialProjectResourcesData}
        timeEntries={timeEntries}
        initialTimeEntriesData={initialTimeEntriesData}
        weeks={weeks}
        isLoading={initialTimeEntriesIsLoading}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        changesMade={changesMade}
        handleReset={handleReset}
        handleCancelEdit={handleCancelEdit}
      />
    </>
  );
}
