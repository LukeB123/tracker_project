import { useFormState } from "react-dom";
import { useEffect } from "react";

import { cancelAbsenceRequestAction } from "@/server/actions/absence-request-action";
import { TAbsenceRequestProps } from "@/server/actions/data-fetches";

import AbsenceEntryButton from "@/app/_components/absence/table/absence-entry-button";

import { useAppDispatch } from "@/app/lib/hooks";
import { uiActions } from "@/app/lib/features/ui/uiSlice";
import { formSatusActions } from "@/app/lib/features/formStatus/formStatusSlice";

export default function AbsenceTableEntryCancelButton({
  request,
}: {
  request: TAbsenceRequestProps;
}) {
  const dispatch = useAppDispatch();

  const [cancelFormState, cancelFormAction] = useFormState(
    cancelAbsenceRequestAction,
    {
      request,
      notification: null,
      // newStatus: undefined,
    }
  );

  // Handle formAction response
  useEffect(() => {
    if (cancelFormState.notification) {
      dispatch(uiActions.showNotification(cancelFormState.notification));
      dispatch(formSatusActions.setFormSatusIsPending(false));
    }
  }, [cancelFormState]);

  return (
    <>
      <p className="italic">TODO: Only see below if this is your request</p>
      <div className="my-4 flex justify-center gap-8">
        <form
          id={"cancel_absence_request_" + request.id}
          action={cancelFormAction}
        >
          <AbsenceEntryButton type="Cancel" />
        </form>
      </div>
    </>
  );
}
