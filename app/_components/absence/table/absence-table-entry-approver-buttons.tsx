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
      dispatch(formSatusActions.setFormSatusIsPending(false));
    }

    if (approveFormState.notification) {
      dispatch(uiActions.showNotification(approveFormState.notification));
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
