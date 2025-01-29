"use server";

import { revalidatePath } from "next/cache";

import { TNotificationState } from "@/lib/ui";
import {
  TNewProjectResourcesProps,
  TNewTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
  addProjectResources,
  addTimeEntries,
  updateTimeEntries,
  updateProjectResources,
  deleteProjectResources,
  deleteTimeEnties,
  getProjectResourceByUniqueIds,
  getResourcesTimeEntries,
} from "@/util/time-entries";
import {
  TProjectDetailsProps,
  updateProjectsLastUpdated,
} from "@/util/projects";
import { TWeekProps } from "@/util/date";

interface TFormState {
  context: "project" | "resource";
  projectResources: (TProjectResourcesProps | TNewProjectResourcesProps)[];
  initialProjectResources: TProjectResourcesProps[];
  timeEntries: (TTimeEntriesProps | TNewTimeEntriesProps)[];
  initialTimeEntries: TTimeEntriesProps[];
  weeks: TWeekProps[];
  notification: TNotificationState | null;
}

export async function projectTimeEntriesAction(
  prevState: TFormState,
  formData: FormData
): Promise<TFormState> {
  const newProjectResourceUniqueIds: string[] = [];

  const newProjectResources: TNewProjectResourcesProps[] = [];
  const newTimeEntries: TNewTimeEntriesProps[] = [];

  const updatedProjectResources: TProjectResourcesProps[] = [];
  const updatedTimeEntries: TTimeEntriesProps[] = [];

  const deletedProjectResourceIds: number[] = [];
  const deletedTimeEntryIds: number[] = [];

  const projectIds: number[] = [];

  const resourceIds: number[] = [];

  try {
    prevState.projectResources.forEach((projectResource) => {
      const isDeleted =
        +(formData.get(
          projectResource.unique_identifier + "_delete"
        ) as string) === 1;

      const newUniqueId =
        projectResource.project_id +
        "_" +
        projectResource.resource_id +
        "_" +
        projectResource.role_id +
        "_" +
        projectResource.rate_grade;

      if (!isDeleted) newProjectResourceUniqueIds.push(newUniqueId);

      if (
        newProjectResourceUniqueIds.filter((entry) => entry === newUniqueId)
          .length > 1
      ) {
        throw new Error();
      }

      if (
        !isDeleted &&
        projectResource.resource_id &&
        !resourceIds.includes(projectResource.resource_id)
      )
        resourceIds.push(projectResource.resource_id);

      if (
        projectResource.project_id &&
        !projectIds.includes(projectResource.project_id)
      )
        projectIds.push(projectResource.project_id);

      const isNewProjectResource = !("id" in projectResource);

      if (!isNewProjectResource) {
        const initialProjectResource = prevState.initialProjectResources.find(
          (initialProjectResource) =>
            initialProjectResource.id === projectResource.id
        )!;

        if (isDeleted) {
          deletedProjectResourceIds.push(projectResource.id);
        } else {
          if (initialProjectResource.unique_identifier !== newUniqueId) {
            const updatedProjectResourceEntry: TProjectResourcesProps = {
              ...projectResource,
              unique_identifier: newUniqueId,
            };

            updatedProjectResources.push(updatedProjectResourceEntry);
          }
        }
      } else if (
        !isDeleted &&
        projectResource.project_id !== undefined &&
        projectResource.resource_id !== undefined &&
        projectResource.role_id !== undefined &&
        projectResource.rate_grade !== ""
      ) {
        const newProjectResourceEntry: TNewProjectResourcesProps = {
          ...projectResource,
          unique_identifier: newUniqueId,
        };

        newProjectResources.push(newProjectResourceEntry);
      } else if (!isDeleted) {
        throw new Error("empty_resource");
      } else {
        // New Entries Marked as Deleted
        return;
      }
    });
  } catch (error: any) {
    if ("message" in error && error.message === "empty_resource") {
      return {
        ...prevState,
        notification: {
          status: "neutral",
          title: "Project Time Entry",
          message: "Please Fill Out All Resources",
        },
      };
    } else {
      return {
        ...prevState,
        notification: {
          status: "neutral",
          title: "Project Time Entry",
          message: "Duplicate Resource And Grade Combination",
        },
      };
    }
  }

  prevState.timeEntries.forEach((timeEntry) => {
    const newUniqueId =
      timeEntry.project_id +
      "_" +
      timeEntry.resource_id +
      "_" +
      timeEntry.role_id +
      "_" +
      timeEntry.rate_grade +
      "_" +
      timeEntry.week_commencing;

    const isNewTimeEntry = !("id" in timeEntry);

    const isDeleted =
      +(formData.get(
        timeEntry.unique_identifier.split("_").slice(0, -1).join("_") +
          "_delete"
      ) as string) === 1;

    if (!isNewTimeEntry) {
      const initialTimeEntry = prevState.initialTimeEntries.find(
        (initialTimeEntry) => initialTimeEntry.id === timeEntry.id
      )!;

      const isUpdatedTimeEntry =
        initialTimeEntry.work_days !== timeEntry.work_days ||
        initialTimeEntry.unique_identifier !== newUniqueId;

      if (isDeleted || timeEntry.work_days === 0) {
        deletedTimeEntryIds.push(timeEntry.id);
      } else if (isUpdatedTimeEntry) {
        const updateTimeEntry: TTimeEntriesProps = {
          ...timeEntry,
          unique_identifier: newUniqueId,
        };

        updatedTimeEntries.push(updateTimeEntry);
      }
    } else if (
      !isDeleted &&
      timeEntry.work_days > 0 &&
      timeEntry.project_id !== undefined &&
      timeEntry.resource_id !== undefined &&
      timeEntry.rate_grade !== ""
    ) {
      const newTimeEntry: TNewTimeEntriesProps = {
        ...timeEntry,
        unique_identifier: newUniqueId,
      };

      newTimeEntries.push(newTimeEntry);
    }
  });

  // console.log("newProjectResources", newProjectResources);
  // console.log("updatedProjectResources", updatedProjectResources);
  // console.log("newTimeEntries", newTimeEntries);
  // console.log("updatedTimeEntries", updatedTimeEntries);
  // console.log("deletedProjectResourceIds", deletedProjectResourceIds);
  // console.log("deletedTimeEntryIds", deletedTimeEntryIds);
  // console.log("newProjectResourceUniqueIds", newProjectResourceUniqueIds);
  // console.log("projectIds", projectIds);
  // console.log("resourceIds", resourceIds);

  try {
    if (newProjectResources.length > 0)
      await addProjectResources(newProjectResources);

    if (updatedProjectResources.length > 0)
      await updateProjectResources(updatedProjectResources);

    if (newTimeEntries.length > 0) await addTimeEntries(newTimeEntries);

    if (updatedTimeEntries.length > 0) {
      await updateTimeEntries(updatedTimeEntries);
      // await deleteZeroedTimeEntries();
    }

    if (deletedProjectResourceIds.length > 0)
      await deleteProjectResources(deletedProjectResourceIds);

    if (deletedTimeEntryIds.length > 0)
      await deleteTimeEnties(deletedTimeEntryIds);

    if (
      newProjectResources.length +
        updatedProjectResources.length +
        newTimeEntries.length +
        updatedTimeEntries.length +
        deletedProjectResourceIds.length +
        deletedTimeEntryIds.length >
      0
    ) {
      // UPDATE PROJECT UPDATED TIMES
      await updateProjectsLastUpdated(projectIds);

      const updatedNewProjectResources = await getProjectResourceByUniqueIds(
        newProjectResourceUniqueIds
      );

      let updatedNewTimeEntries: TTimeEntriesProps[] = [];

      if (resourceIds.length > 0) {
        updatedNewTimeEntries = await getResourcesTimeEntries(
          resourceIds,
          prevState.weeks.map((week) => week.week_commencing)
        );
      }

      // if (prevState.currentProject && prevState.context === "project") {
      //   revalidatePath(
      //     "/projects/" + prevState.currentProject.slug + "/time-entry"
      //   );
      // }

      return {
        ...prevState,
        initialProjectResources: updatedNewProjectResources,
        initialTimeEntries: updatedNewTimeEntries,
        notification: {
          status: "success",
          title: "Project Time Entry",
          message: "Time Entries Updated Successfully",
        },
      };
    } else {
      return {
        ...prevState,
        notification: {
          status: "neutral",
          title: "Project Time Entry",
          message: "No Changes Detected",
        },
      };
    }
  } catch (error) {
    return {
      ...prevState,
      notification: {
        status: "error",
        title: "Project Time Entry",
        message: "Error Updating The Database",
      },
    };
  }
}
