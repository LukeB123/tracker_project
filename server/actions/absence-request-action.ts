"use server";

import { revalidatePath } from "next/cache";

import { TNotificationState } from "@/app/lib/features/ui/uiSlice";
import {
  approveAbsenceRequest,
  cancelAbsenceRequest,
  declineAbsenceRequest,
} from "@/server/util/absence";
import { addAbsenceRequest } from "@/server/util/absence";
import { TNewAbsenceRequestProps } from "@/server/actions/data-fetches";

interface TFormState {
  numberOfEntries: number[];
  notification: TNotificationState | null;
}

export async function absenceRequestAction(
  prevState: TFormState,
  formData: FormData
): Promise<TFormState> {
  const entryIds = [...prevState.numberOfEntries];

  const modelledAbsenceRequests: TNewAbsenceRequestProps[] = [];

  try {
    // Model the data for each row in the form
    entryIds.forEach((entryId) => {
      const resourceId = +(formData.get(
        "resource_" + entryId + "_id"
      )! as string);
      const resourceName: string = formData.get(
        "resource_" + entryId
      )! as string;
      const approverID = +(formData.get(
        "approver_" + entryId + "_id"
      )! as string);
      const approverName: string = formData.get(
        "approver_" + entryId
      )! as string;
      const absenceType: string = formData.get(
        "absence_type_" + entryId
      )! as string;
      const absenceDuration: string = formData.get(
        "absence_duration_" + entryId
      )! as string;
      const startOfAbsence: string = formData.get(
        "start_of_absence_" + entryId
      ) as string;
      const endOfAbsence: string = formData.get(
        "end_of_absence_" + entryId
      ) as string;

      if (
        resourceId === 0 ||
        approverID === 0 ||
        absenceType === "" ||
        absenceDuration === "" ||
        startOfAbsence === "" ||
        endOfAbsence === ""
      ) {
        throw new Error("Missing Input");
      } else {
        if (startOfAbsence > endOfAbsence) {
          throw new Error("End After Start");
        }

        modelledAbsenceRequests.push({
          resource_id: resourceId,
          resource_name: resourceName,
          approver_id: approverID,
          approver_name: approverName,
          absence_type: absenceType,
          absence_duration: absenceDuration,
          start_of_absence: startOfAbsence,
          end_of_absence: endOfAbsence,
          status: "Pending",
        });
      }
    });
  } catch (error: any) {
    if (error.message === "Missing Input") {
      return {
        ...prevState,
        notification: {
          status: "neutral",
          title: "Absence Request",
          message: "Please Fill Out Entire Form.",
        },
      };
    }

    if (error.message === "End After Start") {
      return {
        ...prevState,
        notification: {
          status: "error",
          title: "Absence Request",
          message: "End of Absence Should be After Start of Absence.",
        },
      };
    }
  }

  try {
    if (modelledAbsenceRequests.length > 0)
      await addAbsenceRequest(modelledAbsenceRequests);

    revalidatePath("/absence/");

    return {
      ...prevState,
      notification: {
        status: "success",
        title: "Absence Request",
        message: "Absence Requested Successfully.",
      },
    };
  } catch (error) {
    return {
      ...prevState,
      notification: {
        status: "error",
        title: "Absence Request",
        message: "Error with Database.",
      },
    };
  }
}

interface TResponseFormState {
  id: number;
  notification: TNotificationState | null;
  newStatus: "Pending" | "Approved" | "Declined" | "Cancelled" | undefined;
}

export async function declineAbsenceRequestAction(
  prevState: TResponseFormState,
  formData: FormData
): Promise<TResponseFormState> {
  try {
    await declineAbsenceRequest(prevState.id);

    revalidatePath("/absence/");

    return {
      ...prevState,
      notification: {
        status: "success",
        title: "Absence Request",
        message: "Absence Requested Declined.",
      },
      newStatus: "Declined",
    };
  } catch (error) {
    return {
      ...prevState,
      notification: {
        status: "error",
        title: "Absence Request",
        message: "Error with Database.",
      },
    };
  }
}

export async function acceptAbsenceRequestAction(
  prevState: TResponseFormState,
  formData: FormData
): Promise<TResponseFormState> {
  try {
    await approveAbsenceRequest(prevState.id);

    revalidatePath("/absence/");

    return {
      ...prevState,
      notification: {
        status: "success",
        title: "Absence Request",
        message: "Absence Requested Accepted.",
      },
      newStatus: "Approved",
    };
  } catch (error) {
    return {
      ...prevState,
      notification: {
        status: "error",
        title: "Absence Request",
        message: "Error with Database.",
      },
    };
  }
}

export async function cancelAbsenceRequestAction(
  prevState: TResponseFormState,
  formData: FormData
): Promise<TResponseFormState> {
  try {
    await cancelAbsenceRequest(prevState.id);

    revalidatePath("/absence/");

    return {
      ...prevState,
      notification: {
        status: "success",
        title: "Absence Request",
        message: "Absence Requested Cancelled.",
      },
      newStatus: "Cancelled",
    };
  } catch (error) {
    return {
      ...prevState,
      notification: {
        status: "error",
        title: "Absence Request",
        message: "Error with Database.",
      },
    };
  }
}
