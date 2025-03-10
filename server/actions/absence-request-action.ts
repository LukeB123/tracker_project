"use server";

import { revalidatePath } from "next/cache";

import { TNotificationState } from "@/app/lib/features/ui/uiSlice";
import {
  approveAbsenceRequest,
  cancelAbsenceRequest,
  declineAbsenceRequest,
  addAbsenceRequest,
} from "@/server/util/absence";
import {
  TAbsenceRequestProps,
  TNewAbsenceRequestProps,
  TResourceProps,
} from "@/server/actions/data-fetches";

interface TFormState {
  numberOfEntries: number[];
  resources: TResourceProps[];
  requests: TNewAbsenceRequestProps[];
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
      const resourceEmail = prevState.resources.find(
        (resource) => resource.id === resourceId
      )!.email;
      const approverID = +(formData.get(
        "approver_" + entryId + "_id"
      )! as string);
      const approverName: string = formData.get(
        "approver_" + entryId
      )! as string;
      const approverEmail = prevState.resources.find(
        (resource) => resource.id === approverID
      )!.email;
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
          resource_email: resourceEmail,
          approver_id: approverID,
          approver_name: approverName,
          approver_email: approverEmail,
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
      requests: modelledAbsenceRequests,
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
  request: TAbsenceRequestProps;
  notification: TNotificationState | null;
  // newStatus: "Pending" | "Approved" | "Declined" | "Cancelled" | undefined;
}

export async function declineAbsenceRequestAction(
  prevState: TResponseFormState,
  formData: FormData
): Promise<TResponseFormState> {
  try {
    await declineAbsenceRequest(prevState.request.id);

    revalidatePath("/absence/");

    return {
      ...prevState,
      notification: {
        status: "success",
        title: "Absence Request",
        message: "Absence Requested Declined.",
      },
      // newStatus: "Declined",
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
    await approveAbsenceRequest(prevState.request);

    revalidatePath("/absence/");

    return {
      ...prevState,
      notification: {
        status: "success",
        title: "Absence Request",
        message: "Absence Requested Accepted.",
      },
      // newStatus: "Approved",
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
    await cancelAbsenceRequest(prevState.request.id);

    revalidatePath("/absence/");

    return {
      ...prevState,
      notification: {
        status: "success",
        title: "Absence Request",
        message: "Absence Requested Cancelled.",
      },
      // newStatus: "Cancelled",
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
