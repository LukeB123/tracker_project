"use client";

import { useEffect, useRef, useState } from "react";

import MonthFilter from "@/app/_components/ui/month-filter";
import TimeEntriesTableHeader from "@/app/_components/time-entries/time-entries-table-header";
import TimeEntriesTableRow from "@/app/_components/time-entries/time-entries-table-row";
import AddEntryButton from "@/app/_components/ui/buttons/add-entry-button";
import TimeEntriesForm from "@/app/_components/time-entries/time-entries-form";
import TimeEntriesTableTotals from "@/app/_components/time-entries/time-entries-table-totals";

import { useAppSelector } from "@/app/lib/hooks";
import {
  getProjectsFromServer,
  getResourcesFromServer,
  getRolesFromServer,
  TAbsenceTimeEntriesProps,
  TNewTimeEntriesProps,
  TProjectDetailsProps,
  TProjectResourcesProps,
  TResourceProps,
  TRole,
  TTimeEntriesProps,
  TWeekProps,
} from "@/server/actions/data-fetches";

interface TimeEntriesProps {
  context: "project" | "resource";
  initialProjectResources: TProjectResourcesProps[];
  weeks: TWeekProps[];
  initialTimeEntries: TTimeEntriesProps[];
  absenceTimeEntries: TAbsenceTimeEntriesProps[];
  initialTimeEntriesIsLoading: boolean;
}

export interface TTableWeeksProps extends TWeekProps {
  active: boolean;
  visible: boolean;
}

export default function TimeEntries({
  context,
  initialProjectResources,
  weeks,
  initialTimeEntries,
  absenceTimeEntries,
  initialTimeEntriesIsLoading,
}: TimeEntriesProps) {
  const [projectResources, setProjectResources] = useState<
    TProjectResourcesProps[]
  >(JSON.parse(JSON.stringify(initialProjectResources)));

  const [timeEntries, setTimeEntries] = useState<
    (TTimeEntriesProps | TNewTimeEntriesProps)[]
  >(JSON.parse(JSON.stringify(initialTimeEntries)));

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

  // might remove
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

  const initialProjectResourcesData = useRef(initialProjectResources);

  const initialTimeEntriesData = useRef(initialTimeEntries);

  const [formKey, setFormKey] = useState(0);

  function setInitialYearMonthIndex() {
    const todayDate = new Date();

    let initialYearMonthIndex = {
      year: todayDate.getFullYear(),
      monthIndex: todayDate.getMonth() + 1,
    };

    const isCurrentProject =
      weeks.filter(
        (week) =>
          week.month_index === initialYearMonthIndex.monthIndex &&
          week.year === initialYearMonthIndex.year
      ).length > 0;

    if (!isCurrentProject)
      initialYearMonthIndex = {
        year: weeks[0].year,
        monthIndex: weeks[0].month_index,
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

    let newProjectResource: TProjectResourcesProps;

    if (context === "project" && currentProject) {
      newProjectResource = {
        project_id: currentProject.id,
        project_slug: currentProject.slug,
        project_title: currentProject.title,
        resource_id: 0,
        resource_name: "",
        resource_slug: "",
        role_id: 0,
        role: "",
        rate_grade: "",
        unique_identifier: "new_" + (projectResourceAdded + 1),
      };

      setProjectResources((prevState) => {
        return [...prevState, newProjectResource];
      });
    }

    if (context === "resource" && currentResource) {
      newProjectResource = {
        project_id: 0,
        project_slug: "",
        project_title: "",
        resource_id: currentResource.id,
        resource_name: currentResource.name,
        resource_slug: currentResource.slug,
        role_id: currentResource.role_id,
        role: currentResource.role,
        rate_grade: currentResource.grade,
        unique_identifier: "new_" + (projectResourceAdded + 1),
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

  const tableWeeks: TTableWeeksProps[] = weeks.map((week) => {
    const active =
      week.month_index === yearMonthIndex.monthIndex &&
      week.year === yearMonthIndex.year;

    const tableWeek: TTableWeeksProps = {
      ...week,
      active,
      visible: active,
    };

    return tableWeek;
  });

  if (tableWeeks.filter((week) => week.visible).length !== 5) {
    let nextMonthFirstWeek: TWeekProps | undefined;

    if (yearMonthIndex.monthIndex < 12) {
      nextMonthFirstWeek = weeks.find(
        (week) =>
          week.month_index === yearMonthIndex.monthIndex + 1 &&
          week.year === yearMonthIndex.year &&
          week.week_index === 1
      );
    } else {
      nextMonthFirstWeek = weeks.find(
        (week) =>
          week.month_index === 1 &&
          week.year === yearMonthIndex.year + 1 &&
          week.week_index === 1
      );
    }

    if (nextMonthFirstWeek) {
      tableWeeks[
        tableWeeks.findIndex(
          (week) => week.week_commencing === nextMonthFirstWeek.week_commencing
        )
      ].visible = true;
    }
  }

  useEffect(() => {
    setFormKey(Math.random());
  }, [projectResources, timeEntries]);

  // Fetch all resources if a new resource is added ONCE
  useEffect(() => {
    async function fetchSelection() {
      if (!projectResourceSelection && isEditing) {
        setIsLoading(true);
        setIsError(false);

        try {
          const roles = await getRolesFromServer();

          if (context === "project") {
            const response = await getResourcesFromServer();

            setProjectResourceSelection({
              projects: [],
              resources: response,
              roles,
            });
          }
          if (context === "resource") {
            const response = await getProjectsFromServer();

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
  }, [isEditing]);

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
              tableWeeks={tableWeeks}
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
            {context === "resource" && absenceTimeEntries.length > 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="bg-purple-500 text-grey-50 font-semibold text-center rounded-md py-1 px-2"
                >
                  ABSENCE
                </td>
                {tableWeeks.map((week) => {
                  const absenceTimeEntry = absenceTimeEntries.find(
                    (timeEntry) =>
                      timeEntry.week_commencing === week.week_commencing
                  );

                  let cellClass =
                    "text-center px-2 py-1 rounded-md font-semibold";

                  let textColor = "";

                  let bgColor = "";

                  if (week.active) {
                    bgColor = " bg-blue-200";
                  } else if (!week.active) {
                    bgColor = " bg-grey-100";
                    textColor = " text-grey-300";
                  }

                  cellClass += bgColor + textColor;

                  if (!week.visible) cellClass += " hidden";

                  return (
                    <td key={week.week_commencing} className={cellClass}>
                      {absenceTimeEntry?.work_days}
                    </td>
                  );
                })}
              </tr>
            )}
            {projectResources.map((projectResource) => {
              return (
                <TimeEntriesTableRow
                  key={projectResource.unique_identifier}
                  context={context}
                  projectResource={projectResource}
                  projectResources={projectResources}
                  setProjectResources={setProjectResources}
                  initialProjectResourcesData={initialProjectResourcesData}
                  timeEntries={timeEntries}
                  setTimeEntries={setTimeEntries}
                  absenceTimeEntries={absenceTimeEntries}
                  isEditing={isEditing}
                  tableWeeks={tableWeeks}
                  projectResourceSelection={projectResourceSelection}
                  isLoading={isLoading}
                  isError={isError}
                  changesMade={changesMade}
                  setChangesMade={setChangesMade}
                  setYearMonthIndex={setYearMonthIndex}
                  rowTotalType={rowTotalType}
                  initialTimeEntriesIsLoading={initialTimeEntriesIsLoading}
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
              <TimeEntriesTableTotals
                context={context}
                timeEntries={timeEntries}
                absenceTimeEntries={absenceTimeEntries}
                tableWeeks={tableWeeks}
                setYearMonthIndex={setYearMonthIndex}
                rowTotalType={rowTotalType}
              />
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
