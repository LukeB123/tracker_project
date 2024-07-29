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
import { TWeekProps, getWeeks } from "./date";

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

  // Model the data for each row in the form
  try {
    entryIds.forEach((entryId) => {
      const resourceId = +formData.get("resource_" + entryId + "_id");
      const resourceName: string = formData.get("resource_" + entryId);
      const roleID = +formData.get("role_" + entryId + "_id");
      const roleName: string = formData.get("role_" + entryId);
      const rateGrade: string = formData.get("rate_grade_" + entryId);
      const initialWeek: string = formData.get("week_commencing_" + entryId);
      const daysPerWeek: string = formData.get("work_days_" + entryId);
      const numberOfWeeks: string = formData.get("number_of_weeks_" + entryId);
      const uniqueId =
        prevState.project.id +
        "_" +
        resourceId.toString() +
        "_" +
        roleID.toString() +
        "_" +
        rateGrade;

      if (
        resourceId > 0 &&
        roleID > 0 &&
        rateGrade !== "" &&
        initialWeek !== "" &&
        daysPerWeek !== "" &&
        numberOfWeeks !== ""
      ) {
        // if (!resourceIds.includes(resourceId)) resourceIds.push(resourceId);

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

        const iniialWeekIndex = prevState.weeks.findIndex(
          (week) => week.week_commencing === initialWeek
        );

        let entryWeeks: TWeekProps[];

        if (iniialWeekIndex + +numberOfWeeks >= prevState.weeks.length) {
          entryWeeks = prevState.weeks.slice(iniialWeekIndex);
        } else {
          entryWeeks = prevState.weeks.slice(
            iniialWeekIndex,
            iniialWeekIndex + +numberOfWeeks
          );
        }

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
            work_days: +daysPerWeek,
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
      } else {
        // Throw an error if the form contains empty inputs
        throw new Error();
      }
    });
  } catch (error) {
    return {
      ...prevState,
      notification: {
        status: "netural",
        title: "Project Baseline Entry",
        message: "Please Fill Out Entire Form",
      },
    };
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
        message: "Error Fetching Data From Database",
      },
    };
  }

  // console.log("newProjectResources", newProjectResources);
  // console.log("newTimeEntries", newTimeEntries);
  // console.log("updatedTimeEntries", updatedTimeEntries);
  // console.log("deletedTimeEntryIds", deletedTimeEntryIds);

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

      // if (prevState.currentProject && prevState.context === "project") {
      //   revalidatePath(
      //     "/projects/" + prevState.currentProject.slug + "/time-entry"
      //   );
      // }
    }

    return {
      ...prevState,
      notification: {
        status: "success",
        title: "Project Baseline Entry",
        message: "Time Entries Updated Successfully",
      },
    };
  } catch (error) {
    return {
      ...prevState,
      notification: {
        status: "error",
        title: "Project Baseline Entry",
        message: "Error Updating Data From Database",
      },
    };
  }
}
