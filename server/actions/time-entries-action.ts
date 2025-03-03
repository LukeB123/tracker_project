"use server";

import { TNotificationState } from "@/app/lib/features/ui/uiSlice";
import {
  addTimeEntries,
  updateTimeEntries,
  deleteTimeEnties,
  getResourcesTimeEntries,
  createProjectResourceUnqiueId,
  createTimeEntryUnqiueId,
  getProjectResourcesByProjects,
  getProjectResourcesByResources,
} from "@/server/util/time-entries";
import { updateProjectsLastUpdated } from "@/server/util/projects";
import {
  TNewTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
  TWeekProps,
} from "@/server/actions/data-fetches";

interface TFormState {
  context: "project" | "resource";
  projectResources: TProjectResourcesProps[];
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
  const modelledProjectResourceUniqueIds: string[] = [];

  const newTimeEntries: TNewTimeEntriesProps[] = [];

  const updatedTimeEntries: TTimeEntriesProps[] = [];

  const deletedTimeEntrys: TTimeEntriesProps[] = [];

  // Check that all projectResource data is filled out
  // Check that there arnet any duplicate projectResources
  try {
    prevState.projectResources.forEach((projectResource) => {
      const isDeleted =
        +(formData.get(
          projectResource.unique_identifier + "_delete"
        ) as string) === 1;

      if (
        !isDeleted &&
        (projectResource.project_id === 0 ||
          projectResource.resource_id === 0 ||
          projectResource.role_id === 0 ||
          projectResource.rate_grade === "")
      ) {
        throw new Error("empty_project_resource");
      }

      const newUniqueId = createProjectResourceUnqiueId(projectResource);

      if (!isDeleted) modelledProjectResourceUniqueIds.push(newUniqueId);

      if (
        modelledProjectResourceUniqueIds.filter(
          (entry) => entry === newUniqueId
        ).length > 1
      ) {
        throw new Error();
      }

      return;
    });
  } catch (error: any) {
    if ("message" in error && error.message === "empty_project_resource") {
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
    const newUniqueId = createTimeEntryUnqiueId(timeEntry);

    const isNewTimeEntry = !("id" in timeEntry);

    const isDeleted =
      +(formData.get(
        timeEntry.unique_identifier.split("_").slice(0, -1).join("_") +
          "_delete"
      ) as string) === 1;

    // Update or Delete Existing Entry
    if (!isNewTimeEntry) {
      const initialTimeEntry = prevState.initialTimeEntries.find(
        (initialTimeEntry) => initialTimeEntry.id === timeEntry.id
      )!;

      const isUpdatedTimeEntry =
        initialTimeEntry.work_days !== timeEntry.work_days ||
        initialTimeEntry.unique_identifier !== newUniqueId;

      if (isDeleted || timeEntry.work_days === 0) {
        deletedTimeEntrys.push(timeEntry);
      } else if (isUpdatedTimeEntry) {
        const updateTimeEntry: TTimeEntriesProps = {
          ...timeEntry,
          unique_identifier: newUniqueId,
        };

        updatedTimeEntries.push(updateTimeEntry);
      }
      // New Entry
    } else if (
      !isDeleted &&
      timeEntry.work_days > 0 &&
      timeEntry.project_id !== 0 &&
      timeEntry.resource_id !== 0 &&
      timeEntry.role_id !== 0 &&
      timeEntry.rate_grade !== ""
    ) {
      const newTimeEntry: TNewTimeEntriesProps = {
        ...timeEntry,
        unique_identifier: newUniqueId,
      };

      newTimeEntries.push(newTimeEntry);
    }
  });

  try {
    if (newTimeEntries.length > 0) await addTimeEntries(newTimeEntries);

    if (updatedTimeEntries.length > 0) {
      await updateTimeEntries(updatedTimeEntries);
    }

    if (deletedTimeEntrys.length > 0)
      await deleteTimeEnties(
        deletedTimeEntrys.map((timeEntry) => timeEntry.id)
      );

    if (
      newTimeEntries.length +
        updatedTimeEntries.length +
        deletedTimeEntrys.length >
      0
    ) {
      // UPDATE PROJECT UPDATED TIMES
      const projectIds: number[] = [];
      const resourceIds: number[] = [];

      newTimeEntries.forEach((timeEntry) => {
        if (!projectIds.includes(timeEntry.project_id))
          projectIds.push(timeEntry.project_id);

        if (!resourceIds.includes(timeEntry.resource_id))
          resourceIds.push(timeEntry.resource_id);
      });

      updatedTimeEntries.forEach((timeEntry) => {
        if (!projectIds.includes(timeEntry.project_id))
          projectIds.push(timeEntry.project_id);

        if (!resourceIds.includes(timeEntry.resource_id))
          resourceIds.push(timeEntry.resource_id);
      });

      deletedTimeEntrys.forEach((timeEntry) => {
        if (!projectIds.includes(timeEntry.project_id))
          projectIds.push(timeEntry.project_id);

        if (!resourceIds.includes(timeEntry.resource_id))
          resourceIds.push(timeEntry.resource_id);
      });

      await updateProjectsLastUpdated(projectIds);

      let updatedInitialProjectResources: TProjectResourcesProps[] = [];

      if (prevState.context === "project")
        updatedInitialProjectResources = await getProjectResourcesByProjects(
          projectIds
        );

      if (prevState.context === "resource")
        updatedInitialProjectResources = await getProjectResourcesByResources(
          resourceIds
        );

      let updatedInitialTimeEntries: TTimeEntriesProps[] = [];

      if (resourceIds.length > 0) {
        updatedInitialTimeEntries = await getResourcesTimeEntries(
          resourceIds,
          prevState.weeks.map((week) => week.week_commencing)
        );
      }

      return {
        ...prevState,
        initialProjectResources: updatedInitialProjectResources,
        initialTimeEntries: updatedInitialTimeEntries,
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
