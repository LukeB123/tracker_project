"use server";

import { TNotificationState } from "@/app/lib/features/ui/uiSlice";
import {
  addTimeEntries,
  updateTimeEntries,
  deleteTimeEnties,
  getProjectTimeEntries,
} from "@/server/util/time-entries";
import { updateProjectsLastUpdated } from "@/server/util/projects";
import {
  TNewTimeEntriesProps,
  TProjectDetailsProps,
  TTimeEntriesProps,
  TWeekProps,
} from "@/server/actions/data-fetches";

interface TFormState {
  project: TProjectDetailsProps;
  weeks: TWeekProps[];
  numberOfEntries: number[];
  notification: TNotificationState | null;
}

export async function baselineEntriesAction(
  prevState: TFormState,
  formData: FormData
): Promise<TFormState> {
  const entryIds = [...prevState.numberOfEntries];

  const modelledDataTimeEntries: TNewTimeEntriesProps[] = [];

  const newTimeEntries: TNewTimeEntriesProps[] = [];
  const updatedTimeEntries: TTimeEntriesProps[] = [];
  const deletedTimeEntryIds: number[] = [];

  try {
    // Model the data for each row in the form
    entryIds.forEach((entryId) => {
      const resourceId = +(formData.get(
        "resource_" + entryId + "_id"
      ) as string);

      const resourceName: string = formData.get(
        "resource_" + entryId
      ) as string;

      const roleID = +(formData.get("role_" + entryId + "_id") as string);

      const roleName: string = formData.get("role_" + entryId) as string;

      const rateGrade: string = formData.get("rate_grade_" + entryId) as string;

      const initialWeek: string = formData.get(
        "week_commencing_" + entryId
      ) as string;

      const daysPerWeekString: string = formData.get(
        "work_days_" + entryId
      ) as string;

      const daysPerWeek = +daysPerWeekString;

      const numberOfWeeks = +(formData.get(
        "number_of_weeks_" + entryId
      ) as string);

      const uniqueId: string =
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

        entryWeeks.forEach((entryWeek) => {
          const timeEntryUniqueId = uniqueId + "_" + entryWeek.week_commencing;

          const weekTimeEntry: TNewTimeEntriesProps = {
            project_id: prevState.project.id,
            project_slug: prevState.project.slug,
            project_title: prevState.project.title,
            resource_id: resourceId,
            resource_slug: resourceName.toLowerCase().replaceAll(" ", "-"),
            resource_name: resourceName,
            role_id: roleID,
            role: roleName,
            rate_grade: rateGrade,
            week_commencing: entryWeek.week_commencing,
            work_days: daysPerWeek,
            unique_identifier: timeEntryUniqueId,
          };

          if (
            !modelledDataTimeEntries
              .map((timeEntry) => timeEntry.unique_identifier)
              .includes(timeEntryUniqueId)
          ) {
            modelledDataTimeEntries.push({ ...weekTimeEntry });
          } else {
            const timeEntryIndex = modelledDataTimeEntries.findIndex(
              (timeEntry) => timeEntry.unique_identifier === timeEntryUniqueId
            );

            modelledDataTimeEntries[timeEntryIndex].work_days = daysPerWeek;
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
    const existingTimeEntries = await getProjectTimeEntries(
      prevState.project.id,
      prevState.weeks.map((week) => week.week_commencing)
    );

    modelledDataTimeEntries.forEach((timeEntry) => {
      const existingEntry = existingTimeEntries.find(
        (entry) => entry.unique_identifier === timeEntry.unique_identifier
      );

      if (!existingEntry && timeEntry.work_days > 0) {
        newTimeEntries.push({ ...timeEntry });
      } else if (existingEntry) {
        if (timeEntry.work_days > 0) {
          updatedTimeEntries.push({
            ...existingEntry,
            work_days: timeEntry.work_days,
          });
        } else {
          deletedTimeEntryIds.push(existingEntry.id);
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
    if (newTimeEntries.length > 0) await addTimeEntries(newTimeEntries);

    if (updatedTimeEntries.length > 0)
      await updateTimeEntries(updatedTimeEntries);

    if (deletedTimeEntryIds.length > 0)
      await deleteTimeEnties(deletedTimeEntryIds);

    if (
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
