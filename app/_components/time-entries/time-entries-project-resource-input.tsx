import Icon from "@/app/_components/icons/icons";
import DeleteIconButton from "@/app/_components/delete-icon-button";
import Dropdown from "@/app/_components/dropdown";

import { TPeopleProps } from "@/util/people";
import { TProjectDetailsProps } from "@/util/projects";
import { TWeekProps } from "@/util/date";
import {
  TNewProjectResourcesProps,
  TProjectResourcesProps,
} from "@/util/time-entries";
import { useAppSelector } from "@/lib/hooks";

interface TimeEntriesProjectResourceInputProps {
  context: "project" | "resource";
  projectResourceIndex: number;
  projectResource: TProjectResourcesProps | TNewProjectResourcesProps;
  projectResources: (TProjectResourcesProps | TNewProjectResourcesProps)[];
  setProjectResources: React.Dispatch<
    React.SetStateAction<(TProjectResourcesProps | TNewProjectResourcesProps)[]>
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

export default function TimeEntriesProjectResourceInput({
  context,
  projectResourceIndex,
  projectResource,
  projectResources,
  setProjectResources,
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

  type TResourceOverAllocationMonths = {
    monthYearString: string;
    monthIndex: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    year: number;
  };

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

  let projectResourceClass = "px-2 py-1 w-full h-8 font-semibold";

  let colorClass = "";

  if (isEditing && !isDelete) {
    colorClass = " text-grey-900 bg-purple-200";

    if (resourceOverAllocationWeeks.length > 0) {
      colorClass += " text-red-400";
    }
  } else if (!isEditing && !isDelete) {
    colorClass = " text-grey-50 bg-purple-500";

    if (resourceOverAllocationWeeks.length > 0) {
      colorClass += " text-red-600";
    }
  }

  if (isDelete) {
    colorClass = "text-grey-300 bg-grey-100";
  }

  projectResourceClass += colorClass;

  function handleProjectResourceLabelChange(id: number) {
    // const newValue = options.find((entry) => entry.id === id);

    if (context === "project") {
      const selectedResource = projectResourceSelection?.resources.find(
        (resource) => resource.id === id
      );

      if (selectedResource) {
        setProjectResources((prevState) => {
          const mutatableState: (
            | TProjectResourcesProps
            | TNewProjectResourcesProps
          )[] = JSON.parse(JSON.stringify(prevState));

          mutatableState[projectResourceIndex].resource_id =
            selectedResource.id;
          mutatableState[projectResourceIndex].resource_name =
            selectedResource.name;
          mutatableState[projectResourceIndex].rate_grade =
            selectedResource.grade;

          return mutatableState;
        });
      }
    }

    if (context === "resource") {
      const selectedProject = projectResourceSelection?.projects.find(
        (project) => project.id === id
      );

      if (selectedProject) {
        setProjectResources((prevState) => {
          const mutatableState: (
            | TProjectResourcesProps
            | TNewProjectResourcesProps
          )[] = JSON.parse(JSON.stringify(prevState));

          mutatableState[projectResourceIndex].project_id = selectedProject.id;
          mutatableState[projectResourceIndex].project_slug =
            selectedProject.slug;
          mutatableState[projectResourceIndex].project_title =
            selectedProject.title;

          return mutatableState;
        });
      }
    }

    setChangesMade(true);
  }

  function handleGradeChange(gradeId: number) {
    setProjectResources((prevState) => {
      const mutatableState: (
        | TProjectResourcesProps
        | TNewProjectResourcesProps
      )[] = JSON.parse(JSON.stringify(prevState));

      const newGrade = grades.find((grade) => grade.id === gradeId)?.name;

      mutatableState[projectResourceIndex].rate_grade = newGrade
        ? newGrade
        : "";

      return mutatableState;
    });

    setChangesMade(true);
  }

  let projectResourceLabel = "";

  let options: DropdownItem[] = [];

  if (context === "project") {
    projectResourceLabel = projectResource.resource_name;
    options = projectResourceSelection
      ? projectResourceSelection.resources.map((resource) => {
          return {
            id: resource.id,
            name: resource.name,
          };
        })
      : [];
  }

  if (context === "resource") {
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

  let projectResourcesSelected: string[] = [];

  if (context === "project")
    projectResourcesSelected = projectResources.map(
      (projectResource) => projectResource.resource_name
    );

  if (context === "resource")
    projectResourcesSelected = projectResources.map(
      (projectResource) => projectResource.project_title
    );

  const refinedOptions = options.filter(
    (entry) => !projectResourcesSelected.includes(entry.name)
  );

  const showOverAllocationAlert =
    resourceOverAllocationWeeks.length > 0 && !isDelete;

  let dropdownTitle = "";

  if (isLoading && projectResourceLabel !== "") {
    dropdownTitle = projectResourceLabel;
  } else {
    dropdownTitle = "Select from dropdown";
  }

  return (
    <td className="flex items-center w-full relative">
      {isEditing && (
        <>
          <div className="absolute -left-5 flex items-center">
            <DeleteIconButton
              label={projectResourceLabel}
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
          <div className={"border-r-2 basis-3/4 flex items-center relative"}>
            <Dropdown
              id={projectResource.unique_identifier + "_project_resource_label"}
              title={dropdownTitle}
              form="time_entries_form"
              data={options}
              visibledata={refinedOptions}
              style={
                showOverAllocationAlert
                  ? projectResourceClass + " rounded-l-md truncate pl-6"
                  : projectResourceClass + " rounded-l-md truncate"
              }
              parentSelectedItem={options.find(
                (option) => option.name === projectResourceLabel
              )}
              search={true}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
              onSelect={handleProjectResourceLabelChange}
              disabled={isDelete || formStatusIsPending}
              isLoading={isLoading}
            />
            {resourceOverAllocationWeeks.length > 0 && !isDelete && (
              <div
                className={
                  "group absolute left-1 h-8 w-max flex items-center z-10"
                }
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
          <div className="basis-1/4">
            <Dropdown
              id={projectResource.unique_identifier + "_rate_grade"}
              data={grades}
              parentSelectedItem={grades?.find(
                (grade) => grade.name === projectResource.rate_grade
              )}
              style={projectResourceClass + " rounded-r-md"}
              form="time_entries_form"
              changesMade={changesMade}
              setChangesMade={setChangesMade}
              onSelect={handleGradeChange}
              isLoading={isLoading}
            />
          </div>
        </>
      )}
      {!isEditing && (
        <>
          <div className={"border-r-2 basis-3/4 flex items-center relative"}>
            <p
              className={
                showOverAllocationAlert
                  ? projectResourceClass + " rounded-l-md truncate pl-6"
                  : projectResourceClass + " rounded-l-md truncate"
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
          <div className="basis-1/4">
            <p className={projectResourceClass + " text-center rounded-r-md"}>
              {projectResource.rate_grade}
            </p>
          </div>
        </>
      )}
    </td>
  );
}
