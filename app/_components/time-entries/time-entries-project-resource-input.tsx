import Icon from "@/app/_components/ui/icons";
import DeleteIconButton from "@/app/_components/ui/buttons/delete-icon-button";
import Dropdown from "@/app/_components/ui/buttons/dropdown";
import {
  TNewTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
  TProjectDetailsProps,
  TResourceProps,
  TRole,
} from "@/server/actions/data-fetches";

import { useAppSelector } from "@/app/lib/hooks";
import Link from "next/link";
import { TTableWeeksProps } from "@/app/_components/time-entries/time-entries";

interface TimeEntriesProjectResourceInputProps {
  context: "project" | "resource";
  projectResource: TProjectResourcesProps;
  projectResources: TProjectResourcesProps[];
  setProjectResources: React.Dispatch<
    React.SetStateAction<TProjectResourcesProps[]>
  >;
  initialProjectResourcesData: React.MutableRefObject<TProjectResourcesProps[]>;
  setTimeEntries: React.Dispatch<
    React.SetStateAction<(TTimeEntriesProps | TNewTimeEntriesProps)[]>
  >;
  resourceOverAllocationWeeks: TTableWeeksProps[];
  projectResourceSelection:
    | {
        projects: TProjectDetailsProps[];
        resources: TResourceProps[];
        roles: TRole[];
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
  initialProjectResourcesData,
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

  const rolesSelection = projectResourceSelection
    ? projectResourceSelection.roles.map((role) => {
        return { id: role.id, name: role.role };
      })
    : [];

  const showOverAllocationAlert =
    resourceOverAllocationWeeks.length > 0 && !isDelete;

  const showDuplicateAlert =
    projectResources.filter(
      (entry) =>
        projectResource.project_id !== 0 &&
        entry.project_id === projectResource.project_id &&
        projectResource.resource_id !== 0 &&
        entry.resource_id === projectResource.resource_id &&
        entry.role === projectResource.role &&
        entry.rate_grade === projectResource.rate_grade
    ).length > 1 && !isDelete;

  const resourceOverAllocationMonths: TResourceOverAllocationMonths[] =
    resourceOverAllocationWeeks
      .map((week) => {
        return {
          monthYearString: week.month_year_string,
          monthIndex: week.month_index,
          year: week.year,
        };
      })
      .filter(
        (month, index, array) =>
          array.findIndex(
            (element) => element.monthIndex === month.monthIndex
          ) === index
      );

  let projectResourceClass = "px-2 py-1 w-full h-full font-semibold";

  if (!isEditing) projectResourceClass += " pr-8";

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
      textColor += " text-red-400";
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

  const isExistingEntry =
    projectResource.unique_identifier.slice(0, 3) !== "new";

  let isEdited =
    isExistingEntry &&
    projectResource.unique_identifier !==
      projectResource.project_id +
        "_" +
        projectResource.resource_id +
        "_" +
        projectResource.role_id +
        "_" +
        projectResource.rate_grade;

  function handleResetProjectResource() {
    if (isExistingEntry) {
      const initialProjectResource = {
        ...initialProjectResourcesData.current.find(
          (entry) =>
            entry.unique_identifier === projectResource.unique_identifier
        )!,
      };

      setProjectResources((prevState) => {
        return [
          ...prevState.slice(0, projectResourceIndex),
          {
            ...initialProjectResource,
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
                project_id: initialProjectResource.project_id,
                project_slug: initialProjectResource.project_slug,
                project_title: initialProjectResource.project_title,
                resource_id: initialProjectResource.resource_id,
                resource_name: initialProjectResource.resource_name,
                resource_slug: initialProjectResource.resource_slug,
                role_id: initialProjectResource.role_id,
                role: initialProjectResource.role,
                rate_grade: initialProjectResource.rate_grade,
              };
            } else {
              return { ...entry };
            }
          });

        return newState;
      });
    }
  }

  function handleProjectResourceLabelChange(id: number) {
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
              resource_slug: selectedResource.slug,
              role_id: selectedResource.role_id,
              role: selectedResource.role,
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
                  resource_name: selectedResource.name,
                  resource_slug: selectedResource.slug,
                  role_id: selectedResource.role_id,
                  role: selectedResource.role,
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

  function handleRoleChange(roleId: number) {
    const newRole = rolesSelection.find((role) => role.id === roleId);

    if (newRole) {
      setProjectResources((prevState) => {
        return [
          ...prevState.slice(0, projectResourceIndex),
          {
            ...prevState[projectResourceIndex],
            role_id: newRole.id,
            role: newRole.name,
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
                role_id: newRole.id,
                role: newRole.name,
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

  let href = "";

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

    href = "/resources/" + projectResource.resource_slug;
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

    href = "/projects/" + projectResource.project_slug;
  }

  return (
    <>
      <td className="relative">
        {isEditing && !isEdited && (
          <div className="absolute -left-5 flex items-center h-full">
            <DeleteIconButton
              isDelete={isDelete}
              setIsDelete={setIsDelete}
              setChangesMade={setChangesMade}
              isDisabled={formStatusIsPending}
              useModal={false}
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
        )}
        {isEditing && isEdited && (
          <div className="absolute -left-5 flex items-center h-full">
            <button
              type="button"
              className={"w-max"}
              onClick={handleResetProjectResource}
              disabled={formStatusIsPending}
            >
              <Icon
                iconName="undo"
                color={formStatusIsPending ? "#cccccc" : "#5f249f"}
                height="20px"
                width="20px"
              />
            </button>
          </div>
        )}
        <div className="relative flex items-center">
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
            disabled={isDelete || formStatusIsPending || !isEditing}
            isLoading={isLoading}
          />
          {!isEditing && (
            <Link
              href={href}
              target="_blank"
              className="absolute w-full h-full"
            ></Link>
          )}
          {resourceOverAllocationWeeks.length > 0 && !isDelete && (
            <div
              className={"group absolute left-1 h-full w-max flex items-center"}
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
      </td>
      <td>
        <div className="flex items-center relative">
          <Dropdown
            id={projectResource.unique_identifier + "_role"}
            data={rolesSelection}
            title={projectResource.role}
            parentSelectedItem={rolesSelection.find(
              (role) => role.id === projectResource.role_id
            )}
            style={
              showDuplicateAlert
                ? projectResourceClass +
                  bgColor +
                  gradeTextColor +
                  " truncate pl-6 yellow-600"
                : projectResourceClass + bgColor + gradeTextColor + " truncate"
            }
            search={true}
            changesMade={changesMade}
            setChangesMade={setChangesMade}
            onSelect={handleRoleChange}
            disabled={isDelete || formStatusIsPending || !isEditing}
            isLoading={isLoading}
          />
          {showDuplicateAlert && !isDelete && (
            <div
              className={"group absolute left-1 h-full w-max flex items-center"}
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
      </td>
      <td>
        <div className="flex items-center relative">
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
            disabled={isDelete || formStatusIsPending || !isEditing}
            isLoading={isLoading}
          />
          {showDuplicateAlert && !isDelete && (
            <div
              className={"group absolute left-1 h-full w-max flex items-center"}
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
      </td>
    </>
  );
}
