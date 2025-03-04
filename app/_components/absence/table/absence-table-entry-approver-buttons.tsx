import { useFormState } from "react-dom";
import { useEffect } from "react";

import {
  acceptAbsenceRequestAction,
  declineAbsenceRequestAction,
} from "@/server/actions/absence-request-action";
import { TAbsenceRequestProps } from "@/server/actions/data-fetches";

import AbsenceEntryButton from "@/app/_components/absence/table/absence-entry-button";

import { useAppDispatch } from "@/app/lib/hooks";
import { uiActions } from "@/app/lib/features/ui/uiSlice";
import { formSatusActions } from "@/app/lib/features/formStatus/formStatusSlice";

import sendEmail from "@/app/_hooks/sendEmail";

export default function AbsenceTableEntryApproverButtons({
  request,
}: {
  request: TAbsenceRequestProps;
}) {
  const dispatch = useAppDispatch();

  const [delineFormState, delineFormAction] = useFormState(
    declineAbsenceRequestAction,
    {
      request,
      notification: null,
    }
  );

  const [approveFormState, approveFormAction] = useFormState(
    acceptAbsenceRequestAction,
    {
      request,
      notification: null,
    }
  );

  // Handle formAction response
  useEffect(() => {
    if (delineFormState.notification) {
      dispatch(uiActions.showNotification(delineFormState.notification));

      if (delineFormState.notification.status === "success") {
        const requesterEmail = {
          // to: request.resource_email,
          to: "luke.barnett@dxc.com",
          subject: "Absence Request Declined",
          text: `Your absence request for ${request.start_of_absence} till ${request.end_of_absence} has been declined.`,
        };

        sendEmail(requesterEmail);
      }

      dispatch(formSatusActions.setFormSatusIsPending(false));
    }

    if (approveFormState.notification) {
      dispatch(uiActions.showNotification(approveFormState.notification));

      if (approveFormState.notification.status === "success") {
        const requesterEmail = {
          // to: request.resource_email,
          to: "luke.barnett@dxc.com",
          subject: "Absence Request Approved",
          text: `Your absence request for ${request.start_of_absence} till ${request.end_of_absence} has been approved.`,
        };

        sendEmail(requesterEmail);
      }

      dispatch(formSatusActions.setFormSatusIsPending(false));
    }
  }, [delineFormState, approveFormState]);

  return (
    <>
      <p className="italic">TODO: Only see below if you are set as approver</p>
      <div className="my-4 flex justify-center gap-8">
        <form
          id={"decline_absence_request_" + request.id}
          action={delineFormAction}
        >
          <AbsenceEntryButton type="Decline" />
        </form>
        <form
          id={"accept_absence_request_" + request.id}
          action={approveFormAction}
        >
          <AbsenceEntryButton type="Approve" />
        </form>
      </div>
    </>
  );
}
