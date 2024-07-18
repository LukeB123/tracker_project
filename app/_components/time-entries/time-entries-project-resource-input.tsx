import Icon from "@/app/_components/icons/icons";
import DeleteIconButton from "@/app/_components/delete-icon-button";
import Dropdown from "@/app/_components/dropdown";

import { TPeopleProps } from "@/util/people";
import { TProjectDetailsProps } from "@/util/projects";
import { TWeekProps } from "@/util/date";
import {
  TNewProjectResourcesProps,
  TNewTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
} from "@/util/time-entries";
import { useAppSelector } from "@/lib/hooks";

interface TimeEntriesProjectResourceInputProps {
  context: "project" | "resource";
  projectResource: TProjectResourcesProps | TNewProjectResourcesProps;
  projectResources: (TProjectResourcesProps | TNewProjectResourcesProps)[];
  setProjectResources: React.Dispatch<
    React.SetStateAction<(TProjectResourcesProps | TNewProjectResourcesProps)[]>
  >;
  setTimeEntries: React.Dispatch<
    React.SetStateAction<(TTimeEntriesProps | TNewTimeEntriesProps)[]>
  >;
  resourceOverAllocationWeeks: TWeekProps[];
  projectResourceSelection:
    | {
        projects: TProjectDetailsProps[];
        resources: TPeopleProps[];
      }
    | undefined;
  isEditing: boolean;
  isLoading: boolean;
  isError: boolean;
  isDelete: boolean;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  changesMade: boolean;
  setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
  setYearMonthIndex: React.Dispatch<
    React.SetStateAction<{
      year: number;
      monthIndex: number;
    }>
  >;
}

interface DropdownItem {
  id: number;
  name: string;
  imageUrl?: string;
}

const grades = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
  { id: 7, name: "7" },
];

type TResourceOverAllocationMonths = {
  monthYearString: string;
  monthIndex: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  year: number;
};

export default function TimeEntriesProjectResourceInput({
  context,
  projectResource,
  projectResources,
  setProjectResources,
  setTimeEntries,
  resourceOverAllocationWeeks,
  projectResourceSelection,
  isEditing,
  isLoading,
  isError,
  isDelete,
  setIsDelete,
  changesMade,
  setChangesMade,
  setYearMonthIndex,
}: TimeEntriesProjectResourceInputProps) {
  const formStatusIsPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  );

  const showOverAllocationAlert =
    resourceOverAllocationWeeks.length > 0 && !isDelete;

  const showDuplicateAlert =
    projectResources.filter(
      (entry) =>
        entry.project_id !== undefined &&
        entry.resource_id !== undefined &&
        entry.project_id === projectResource.project_id &&
        entry.resource_id === projectResource.resource_id &&
        entry.rate_grade === projectResource.rate_grade
    ).length > 1 && !isDelete;

  const resourceOverAllocationMonths: TResourceOverAllocationMonths[] =
    resourceOverAllocationWeeks
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

  const projectResourceClass = "px-2 py-1 w-full h-8 font-semibold";

  let textColor = "";

  let bgColor = "";

  let gradeTextColor = "";

  if (isEditing && !isDelete) {
    bgColor = " bg-purple-200";
    textColor = " text-grey-900";
    gradeTextColor = " text-grey-900";

    if (resourceOverAllocationWeeks.length > 0) {
      textColor += " text-red-400";
    }
  } else if (!isEditing && !isDelete) {
    bgColor = " bg-purple-500";
    textColor = " text-grey-50";
    gradeTextColor = " text-grey-50";

    if (resourceOverAllocationWeeks.length > 0) {
      textColor += " text-red-600";
    }
  }

  if (isDelete) {
    bgColor = " bg-grey-100";
    textColor = " text-grey-300";
    gradeTextColor = " text-grey-300";
  }

  const projectResourceIndex = projectResources.findIndex(
    (entry) => entry.unique_identifier === projectResource.unique_identifier
  );

  function handleProjectResourceLabelChange(id: number) {
    // const newValue = options.find((entry) => entry.id === id);

    if (context === "project") {
      const selectedResource = projectResourceSelection?.resources.find(
        (resource) => resource.id === id
      );

      if (selectedResource) {
        setProjectResources((prevState) => {
          return [
            ...prevState.slice(0, projectResourceIndex),
            {
              ...prevState[projectResourceIndex],
              resource_id: selectedResource.id,
              resource_name: selectedResource.name,
              rate_grade: selectedResource.grade,
            },
            ...prevState.slice(projectResourceIndex + 1),
          ];
        });

        setTimeEntries((prevState) => {
          const newState: (TTimeEntriesProps | TNewTimeEntriesProps)[] =
            prevState.map((entry) => {
              if (
                entry.unique_identifier.split("_").slice(0, -1).join("_") ===
                projectResource.unique_identifier
              ) {
                return {
                  ...entry,
                  resource_id: selectedResource.id,
                  rate_grade: selectedResource.grade,
                };
              } else {
                return { ...entry };
              }
            });

          return newState;
        });
      }
    }

    if (context === "resource") {
      const selectedProject = projectResourceSelection?.projects.find(
        (project) => project.id === id
      );

      if (selectedProject) {
        setProjectResources((prevState) => {
          return [
            ...prevState.slice(0, projectResourceIndex),
            {
              ...prevState[projectResourceIndex],
              project_id: selectedProject.id,
              project_slug: selectedProject.slug,
              project_title: selectedProject.title,
            },
            ...prevState.slice(projectResourceIndex + 1),
          ];
        });

        setTimeEntries((prevState) => {
          const newState: (TTimeEntriesProps | TNewTimeEntriesProps)[] =
            prevState.map((entry) => {
              if (
                entry.unique_identifier.split("_").slice(0, -1).join("_") ===
                projectResource.unique_identifier
              ) {
                return {
                  ...entry,
                  project_id: selectedProject.id,
                  project_slug: selectedProject.slug,
                  project_title: selectedProject.title,
                };
              } else {
                return { ...entry };
              }
            });

          return newState;
        });
      }
    }

    setChangesMade(true);
  }

  function handleGradeChange(gradeId: number) {
    const newGrade = grades.find((grade) => grade.id === gradeId)?.name;

    if (newGrade) {
      setProjectResources((prevState) => {
        return [
          ...prevState.slice(0, projectResourceIndex),
          {
            ...prevState[projectResourceIndex],
            rate_grade: newGrade,
          },
          ...prevState.slice(projectResourceIndex + 1),
        ];
      });

      setTimeEntries((prevState) => {
        const newState: (TTimeEntriesProps | TNewTimeEntriesProps)[] =
          prevState.map((entry) => {
            if (
              entry.unique_identifier.split("_").slice(0, -1).join("_") ===
              projectResource.unique_identifier
            ) {
              return {
                ...entry,
                rate_grade: newGrade,
              };
            } else {
              return { ...entry };
            }
          });

        return newState;
      });
    }

    setChangesMade(true);
  }

  let projectResourceLabel: string | undefined;

  let options: DropdownItem[] = [];

  if (context === "project") {
    if (projectResource.resource_name !== "")
      projectResourceLabel = projectResource.resource_name;

    options = projectResourceSelection
      ? projectResourceSelection.resources.map((resource) => {
          return {
            id: resource.id,
            name: resource.name,
          };
        })
      : [];
  } else if (context === "resource") {
    if (projectResource.project_title !== "")
      projectResourceLabel = projectResource.project_title;

    options = projectResourceSelection
      ? projectResourceSelection.projects.map((project) => {
          return {
            id: project.id,
            name: project.title,
          };
        })
      : [];
  }

  return (
    <td className="flex items-center w-full relative">
      {isEditing && (
        <>
          <div className="absolute -left-5 flex items-center">
            <DeleteIconButton
              isDelete={isDelete}
              setIsDelete={setIsDelete}
              setChangesMade={setChangesMade}
              isDisabled={formStatusIsPending}
              showModal={false}
            />
            <input
              name={projectResource.unique_identifier + "_delete"}
              value={isDelete ? 1 : 0}
              onChange={() => {}}
              className="hidden"
              readOnly
              form="time_entries_form"
            />
          </div>
          <div className="border-r-2 basis-3/4 flex items-center relative">
            <Dropdown
              id={projectResource.unique_identifier + "_project_resource_label"}
              title={projectResourceLabel}
              data={options}
              parentSelectedItem={options.find(
                (option) => option.name === projectResourceLabel
              )}
              style={
                showOverAllocationAlert
                  ? projectResourceClass +
                    bgColor +
                    textColor +
                    " rounded-l-md truncate pl-6"
                  : projectResourceClass +
                    bgColor +
                    textColor +
                    " rounded-l-md truncate"
              }
              search={true}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
              onSelect={handleProjectResourceLabelChange}
              disabled={isDelete || formStatusIsPending}
              isLoading={isLoading}
            />
            {resourceOverAllocationWeeks.length > 0 && !isDelete && (
              <div
                className={"group absolute left-1 h-8 w-max flex items-center"}
              >
                <Icon
                  iconName={"alert"}
                  color={"#fe677b"}
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
          <div className="basis-1/4 flex items-center relative">
            <Dropdown
              id={projectResource.unique_identifier + "_rate_grade"}
              data={grades}
              parentSelectedItem={grades.find(
                (grade) => grade.name === projectResource.rate_grade
              )}
              style={
                showDuplicateAlert
                  ? projectResourceClass +
                    bgColor +
                    gradeTextColor +
                    " rounded-r-md truncate pl-6 yellow-600"
                  : projectResourceClass +
                    bgColor +
                    gradeTextColor +
                    " rounded-r-md truncate"
              }
              changesMade={changesMade}
              setChangesMade={setChangesMade}
              onSelect={handleGradeChange}
              disabled={isDelete || formStatusIsPending}
              isLoading={isLoading}
            />
            {showDuplicateAlert && !isDelete && (
              <div
                className={"group absolute left-1 h-8 w-max flex items-center"}
              >
                <Icon
                  iconName={"alert"}
                  color={"#f6c709"}
                  height="15px"
                  width="15px"
                />
                <div className="hidden group-hover:block absolute top-5 -right-1 z-10 bg-blue-100 rounded-md border-2 border-blue-300 py-1 px-2 w-max h-fit text-sm text-grey-900 shadow-md">
                  <h2 className="pb-1">Duplicate Resource Grade</h2>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {!isEditing && (
        <>
          <div className={"border-r-2 basis-3/4 flex items-center relative"}>
            <p
              className={
                showOverAllocationAlert
                  ? projectResourceClass +
                    bgColor +
                    textColor +
                    " rounded-l-md truncate pl-6"
                  : projectResourceClass +
                    bgColor +
                    textColor +
                    " rounded-l-md truncate"
              }
            >
              {projectResourceLabel}
            </p>

            {resourceOverAllocationWeeks.length > 0 && !isDelete && (
              <div
                className={"group absolute left-1 h-8 w-max flex items-center"}
              >
                <div className="cursor-pointer">
                  <Icon
                    iconName={"alert"}
                    color={"#fe344f"}
                    height="15px"
                    width="15px"
                  />
                </div>
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
          <div className="basis-1/4 flex items-center relative">
            <p
              className={
                showDuplicateAlert
                  ? projectResourceClass +
                    bgColor +
                    gradeTextColor +
                    " text-center rounded-r-md truncate pl-6"
                  : projectResourceClass +
                    bgColor +
                    gradeTextColor +
                    " text-center rounded-r-md truncate"
              }
            >
              {projectResource.rate_grade}
            </p>

            {showDuplicateAlert && !isDelete && (
              <div
                className={"group absolute left-1 h-8 w-max flex items-center"}
              >
                <Icon
                  iconName={"alert"}
                  color={"#f6c709"}
                  height="15px"
                  width="15px"
                />
                <div className="hidden group-hover:block absolute top-5 -right-1 z-10 bg-blue-100 rounded-md border-2 border-blue-300 py-1 px-2 w-max h-fit text-sm text-grey-900 shadow-md">
                  <h2 className="pb-1">Duplicate Resource Grade</h2>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </td>
  );
}
