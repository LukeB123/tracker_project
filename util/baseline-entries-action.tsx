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
  deleteZeroedTimeEntries,
  updateTimeEntries,
  updateProjectResources,
  deleteProjectResources,
  deleteTimeEnties,
  getProjectResourceByProjectResource,
  getResourcesTimeEntries,
} from "@/util/time-entries";
import {
  TProjectDetailsProps,
  updateProjectsLastUpdated,
} from "@/util/projects";

interface TFormState {
  numberOfEntries: number;
  notification: TNotificationState | null;
}

export async function baselineEntriesAction(
  prevState: TFormState,
  formData: any
): Promise<TFormState> {
  const newProjectResources: TNewProjectResourcesProps[] = [];
  const newTimeEntries: TNewTimeEntriesProps[] = [];

  const updatedProjectResources: TProjectResourcesProps[] = [];
  const updatedTimeEntries: TTimeEntriesProps[] = [];

  const deletedProjectResourceIds: number[] = [];
  const deletedTimeEntryIds: number[] = [];

  const updatedProjectIds: number[] = [];

  const newProjectResourcesState: (
    | TProjectResourcesProps
    | TNewProjectResourcesProps
  )[] = [];

  // console.log(prevState.projectResources);

  prevState.projectResources.forEach((projectResource) => {
    if (
      projectResource.project_id &&
      !updatedProjectIds.includes(projectResource.project_id)
    )
      updatedProjectIds.push(projectResource.project_id);

    let initialProjectResource: TProjectResourcesProps | undefined;

    const isDeleted =
      +formData.get(projectResource.unique_identifier + "_delete") === 1;

    let isUpdatedProjectResource = false;

    const isNewProjectResource = !("id" in projectResource);

    if (!isNewProjectResource)
      initialProjectResource = prevState.initialProjectResources.find(
        (initialProjectResource) =>
          initialProjectResource.id === projectResource.id
      );

    const newUniqueId =
      projectResource.project_id +
      "_" +
      projectResource.resource_id +
      "_" +
      projectResource.rate_grade;

    if (!isNewProjectResource) {
      if (isDeleted) {
        deletedProjectResourceIds.push(projectResource.id);
      } else {
        isUpdatedProjectResource =
          initialProjectResource !== undefined &&
          initialProjectResource.unique_identifier !== newUniqueId;

        const isUpdatedRateGrade =
          initialProjectResource !== undefined &&
          initialProjectResource.rate_grade !== projectResource.rate_grade;

        if (isUpdatedProjectResource || isUpdatedRateGrade) {
          const updatedProjectResourceEntry: TProjectResourcesProps = {
            id: projectResource.id,
            project_id: projectResource.project_id,
            project_slug: projectResource.project_slug,
            project_title: projectResource.project_title,
            resource_id: projectResource.resource_id,
            resource_name: projectResource.resource_name,
            rate_grade: projectResource.rate_grade,
            unique_identifier: newUniqueId,
          };
          updatedProjectResources.push(updatedProjectResourceEntry);

          newProjectResourcesState.push(updatedProjectResourceEntry);
        } else if (initialProjectResource) {
          newProjectResourcesState.push(initialProjectResource);
        }
      }
    } else if (
      !isDeleted &&
      projectResource.project_id !== undefined &&
      projectResource.resource_id !== undefined
    ) {
      const newProjectResourceEntry: TNewProjectResourcesProps = {
        project_id: projectResource.project_id,
        project_slug: projectResource.project_slug,
        project_title: projectResource.project_title,
        resource_id: projectResource.resource_id,
        resource_name: projectResource.resource_name,
        rate_grade: projectResource.rate_grade,
        unique_identifier: newUniqueId,
      };

      newProjectResources.push(newProjectResourceEntry);

      newProjectResourcesState.push(newProjectResourceEntry);
    } else {
      return;
    }

    // Iterate over the weeks to handle each time entry
    prevState.weeks.map((week) => {
      let initialTimeEntry = prevState.timeEntries.find(
        (timeEntry) =>
          timeEntry.unique_identifier ===
          projectResource.unique_identifier + "_" + week.week_commencing
      );

      const newTimeEntryValue: number = +formData.get(
        projectResource.unique_identifier + "_" + week.week_commencing
      );

      if (
        !isNewProjectResource &&
        initialTimeEntry &&
        (isDeleted || newTimeEntryValue === 0)
      ) {
        // Existing Time Entry to be deleted

        deletedTimeEntryIds.push(initialTimeEntry.id);
      } else if (
        !isNewProjectResource &&
        initialTimeEntry &&
        newTimeEntryValue > 0
      ) {
        const timeEntryChanged =
          initialTimeEntry.work_days !== newTimeEntryValue;

        if (timeEntryChanged || isUpdatedProjectResource) {
          // Existing Time Entry to be updated

          const updateTimeEntry: TTimeEntriesProps = {
            id: initialTimeEntry.id,
            project_id: projectResource.project_id,
            project_slug: projectResource.project_slug,
            project_title: projectResource.project_title,
            resource_id: projectResource.resource_id,
            week_commencing: week.week_commencing,
            work_days: newTimeEntryValue,
            unique_identifier: newUniqueId + "_" + week.week_commencing,
          };

          updatedTimeEntries.push(updateTimeEntry);
        }
      } else if (
        (isNewProjectResource || !initialTimeEntry) &&
        newTimeEntryValue > 0 &&
        projectResource.project_id !== undefined &&
        projectResource.resource_id !== undefined
      ) {
        // New Time Entry
        // Only add time entries with value greater than zero
        const newTimeEntry: TNewTimeEntriesProps = {
          project_id: projectResource.project_id,
          project_slug: projectResource.project_slug,
          project_title: projectResource.project_title,
          resource_id: projectResource.resource_id,
          week_commencing: week.week_commencing,
          work_days: newTimeEntryValue,
          unique_identifier: newUniqueId + "_" + week.week_commencing,
        };

        newTimeEntries.push(newTimeEntry);
      }
    });
  });

  // console.log("newProjectResources", newProjectResources);
  // console.log("updatedProjectResources", updatedProjectResources);
  // console.log("newTimeEntries", newTimeEntries);
  // console.log("updatedTimeEntries", updatedTimeEntries);
  // console.log("deletedProjectResourceIds", deletedProjectResourceIds);
  // console.log("deletedTimeEntryIds", deletedTimeEntryIds);
  // console.log("updatedProjectIds", updatedProjectIds);

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
      await updateProjectsLastUpdated(updatedProjectIds);

      const updatedNewProjectResourcesState = await Promise.all(
        newProjectResourcesState.map((projectResource) => {
          if ("id" in projectResource) return projectResource;

          return getProjectResourceByProjectResource(
            projectResource.unique_identifier
          );
        })
      );

      const resourceIds = updatedNewProjectResourcesState.map(
        (entry) => entry.resource_id
      );

      let updatedTimeEntriesState: TTimeEntriesProps[] = [];

      if (resourceIds.length > 0) {
        updatedTimeEntriesState = await getResourcesTimeEntries(
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
        projectResources: updatedNewProjectResourcesState,
        initialProjectResources: updatedNewProjectResourcesState,
        timeEntries: updatedTimeEntriesState,
        notification: {
          status: "success",
          title: "Project Time Entry",
          message: "Time Entries Updated Successfully",
        },
      };
    } else {
      return {
        ...prevState,
        projectResources: newProjectResourcesState,
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
