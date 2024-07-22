"use client";

import { useEffect, useRef, useState } from "react";

import MonthFilter from "@/app/_components/month-filter/month-filter";
import TimeEntriesTableHeader from "@/app/_components/time-entries/time-entries-table-header";
import TimeEntriesTableRow from "@/app/_components/time-entries/time-entries-table-row";
import AddEntryButton from "@/app/_components/buttons/add-entry-button";
import TimeEntriesForm from "@/app/_components/time-entries/time-entries-form";

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

  const currentProject = useAppSelector(
    (state) => state.projects.currentProject
  );

  // const currentResource = useAppSelector((state) => state.resources.currentResource);
  const currentResource: TResourceProps = {
    id: 30,
    name: "Luke",
    grade: "5",
    role_id: 3,
    role: "Developer",
    team: "Wolfpack",
    is_delivery_manager: 0,
    is_project_manager: 0,
    is_scrum_master: 0,
  };

  const formStatusPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  );

  const initialProjectResourcesData: React.MutableRefObject<
    TProjectResourcesProps[]
  > = useRef(initialProjectResources);

  const initialTimeEntriesData: React.MutableRefObject<TTimeEntriesProps[]> =
    useRef(initialTimeEntries);

  const minYear = weeks.reduce(function (prev, week) {
    return prev.year < week.year ? prev : week;
  }).year;

  const minMonthIndex = weeks
    .filter((week) => week.year === minYear)
    .reduce(function (prev, week) {
      return prev.monthIndex < week.monthIndex ? prev : week;
    }).monthIndex;

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
      initialYearMonthIndex = { year: minYear, monthIndex: minMonthIndex };

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

  const maxYear = weeks.reduce(function (prev, week) {
    return prev.year < week.year ? week : prev;
  }).year;

  const maxMonthIndex = weeks
    .filter((week) => week.year === maxYear)
    .reduce(function (prev, week) {
      return prev.monthIndex < week.monthIndex ? week : prev;
    }).monthIndex;

  if (
    visibleWeeks.length < 5 &&
    (yearMonthIndex.year < maxYear || yearMonthIndex.monthIndex < maxMonthIndex)
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

  return (
    <>
      <MonthFilter
        weeks={weeks}
        yearMonthIndex={yearMonthIndex}
        minYearMonthIndex={{ year: minYear, monthIndex: minMonthIndex }}
        maxYearMonthIndex={{ year: maxYear, monthIndex: maxMonthIndex }}
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
            />
          </thead>
          <tbody>
            {!(projectResources.length > 0) && !isEditing && (
              <tr>
                <td className="">
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
                />
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                {isEditing && (
                  <button
                    type="button"
                    className="w-full h-6 lg:h-8"
                    onClick={handleAddProjectResource}
                    disabled={formStatusPending}
                  >
                    <AddEntryButton isDisabled={formStatusPending} />
                  </button>
                )}
              </td>
            </tr>
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
