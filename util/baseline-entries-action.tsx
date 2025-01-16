"use server";

import { revalidatePath } from "next/cache";

import { TNotificationState } from "@/lib/ui";
import {
  TNewProjectResourcesProps,
  TNewTimeEntriesProps,
  TTimeEntriesProps,
  addProjectResources,
  addTimeEntries,
  updateTimeEntries,
  deleteTimeEnties,
  getProjectResourcesByProjectId,
  getProjectTimeEntries,
} from "@/util/time-entries";
import {
  TProjectDetailsProps,
  updateProjectsLastUpdated,
} from "@/util/projects";
import { TWeekProps, getWeeks } from "@/util/date";

interface TFormState {
  project: TProjectDetailsProps;
  weeks: TWeekProps[];
  numberOfEntries: number[];
  notification: TNotificationState | null;
}

export async function baselineEntriesAction(
  prevState: TFormState,
  formData: any
): Promise<TFormState> {
  const entryIds = [...prevState.numberOfEntries];

  const modelledDataProjectResources: TNewProjectResourcesProps[] = [];
  const modelledDataTimeEntries: TNewTimeEntriesProps[] = [];
  const modelledTimeEntryUniqueIds: string[] = [];

  const newProjectResources: TNewProjectResourcesProps[] = [];

  const newTimeEntries: TNewTimeEntriesProps[] = [];
  const updatedTimeEntries: TTimeEntriesProps[] = [];

  const deletedTimeEntryIds: number[] = [];

  try {
    // Model the data for each row in the form
    entryIds.forEach((entryId) => {
      const resourceId = +formData.get("resource_" + entryId + "_id");
      const resourceName: string = formData.get("resource_" + entryId);
      const roleID = +formData.get("role_" + entryId + "_id");
      const roleName: string = formData.get("role_" + entryId);
      const rateGrade: string = formData.get("rate_grade_" + entryId);
      const initialWeek: string = formData.get("week_commencing_" + entryId);
      const daysPerWeekString = formData.get("work_days_" + entryId);
      const daysPerWeek = +formData.get("work_days_" + entryId);
      const numberOfWeeks = +formData.get("number_of_weeks_" + entryId);
      const uniqueId =
        prevState.project.id +
        "_" +
        resourceId.toString() +
        "_" +
        roleID.toString() +
        "_" +
        rateGrade;

      if (
        resourceId === 0 ||
        roleID === 0 ||
        rateGrade === "" ||
        initialWeek === "" ||
        daysPerWeekString === "" ||
        numberOfWeeks === 0
      ) {
        throw new Error("Missing Input");
      } else {
        // if (!resourceIds.includes(resourceId)) resourceIds.push(resourceId);

        const iniialWeekIndex = prevState.weeks.findIndex(
          (week) => week.week_commencing === initialWeek
        );

        let entryWeeks: TWeekProps[];

        if (iniialWeekIndex + numberOfWeeks > prevState.weeks.length) {
          throw new Error("Exceed Project Length");
        } else if (iniialWeekIndex + numberOfWeeks === prevState.weeks.length) {
          entryWeeks = prevState.weeks.slice(iniialWeekIndex);
        } else {
          entryWeeks = prevState.weeks.slice(
            iniialWeekIndex,
            iniialWeekIndex + numberOfWeeks
          );
        }

        modelledDataProjectResources.push({
          project_id: prevState.project.id,
          project_slug: prevState.project.slug,
          project_title: prevState.project.title,
          resource_id: resourceId,
          resource_name: resourceName,
          resource_slug: resourceName.toLowerCase().replaceAll(" ", "-"),
          role_id: roleID,
          role: roleName,
          rate_grade: rateGrade,
          unique_identifier: uniqueId,
        });

        entryWeeks.forEach((entryWeek) => {
          const timeEntryUniqueId = uniqueId + "_" + entryWeek.week_commencing;

          const weekTimeEntry: TNewTimeEntriesProps = {
            project_id: prevState.project.id,
            project_slug: prevState.project.slug,
            project_title: prevState.project.title,
            resource_id: resourceId,
            role_id: roleID,
            rate_grade: rateGrade,
            week_commencing: entryWeek.week_commencing,
            work_days: daysPerWeek,
            unique_identifier: timeEntryUniqueId,
          };

          if (!modelledTimeEntryUniqueIds.includes(timeEntryUniqueId)) {
            modelledTimeEntryUniqueIds.push(timeEntryUniqueId);

            modelledDataTimeEntries.push(weekTimeEntry);
          } else {
            const timeEntryIndex = modelledDataTimeEntries.findIndex(
              (timeEntry) => timeEntry.unique_identifier === timeEntryUniqueId
            );

            modelledDataTimeEntries[timeEntryIndex] = weekTimeEntry;
          }
        });
      }
    });
  } catch (error: any) {
    if (error.message === "Missing Input") {
      return {
        ...prevState,
        notification: {
          status: "neutral",
          title: "Project Baseline Entry",
          message: "Please Fill Out Entire Form.",
        },
      };
    }

    if (error.message === "Exceed Project Length") {
      return {
        ...prevState,
        notification: {
          status: "error",
          title: "Project Baseline Entry",
          message: "Submission Exceeds the Length of the Project.",
        },
      };
    }
  }

  // Add new project resources to array
  // Split time entries into new, updated and deleted
  try {
    const existingProjectResources = await getProjectResourcesByProjectId(
      prevState.project.id
    );

    modelledDataProjectResources.forEach((entry) => {
      const isNewProjectResource =
        !existingProjectResources
          .map((projectResource) => projectResource.unique_identifier)
          .includes(entry.unique_identifier) &&
        !newProjectResources
          .map((newProjectResource) => newProjectResource.unique_identifier)
          .includes(entry.unique_identifier);

      if (isNewProjectResource) newProjectResources.push(entry);
    });

    const existingTimeEntries = await getProjectTimeEntries(
      prevState.project.id,
      prevState.weeks.map((week) => week.week_commencing)
    );

    modelledDataTimeEntries.forEach((timeEntry) => {
      const isNewTimeEntry = !existingTimeEntries
        .map((entry) => entry.unique_identifier)
        .includes(timeEntry.unique_identifier);

      if (isNewTimeEntry && timeEntry.work_days > 0) {
        newTimeEntries.push(timeEntry);
      } else if (!isNewTimeEntry) {
        const existingId = existingTimeEntries.find(
          (entry) => entry.unique_identifier === timeEntry.unique_identifier
        )!.id;

        if (timeEntry.work_days > 0) {
          updatedTimeEntries.push({ id: existingId, ...timeEntry });
        } else {
          deletedTimeEntryIds.push(existingId);
        }
      }
    });
  } catch (error) {
    return {
      ...prevState,
      notification: {
        status: "error",
        title: "Project Baseline Entry",
        message: "Error Fetching Data From Database.",
      },
    };
  }

  try {
    if (newProjectResources.length > 0)
      await addProjectResources(newProjectResources);

    if (newTimeEntries.length > 0) await addTimeEntries(newTimeEntries);

    if (updatedTimeEntries.length > 0)
      await updateTimeEntries(updatedTimeEntries);

    if (deletedTimeEntryIds.length > 0)
      await deleteTimeEnties(deletedTimeEntryIds);

    if (
      newProjectResources.length +
        newTimeEntries.length +
        updatedTimeEntries.length +
        deletedTimeEntryIds.length >
      0
    ) {
      // UPDATE PROJECT UPDATED TIMES
      await updateProjectsLastUpdated([prevState.project.id]);
    }

    return {
      ...prevState,
      notification: {
        status: "success",
        title: "Project Baseline Entry",
        message: "Time Entries Updated Successfully.",
      },
    };
  } catch (error) {
    return {
      ...prevState,
      notification: {
        status: "error",
        title: "Project Baseline Entry",
        message: "Error with Database.",
      },
    };
  }
}
