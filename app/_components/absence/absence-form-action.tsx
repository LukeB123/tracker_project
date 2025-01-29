"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import { uiActions } from "@/lib/features/ui/uiSlice";
import { useAppDispatch } from "@/lib/hooks";
import AbsenceFormButtons from "@/app/_components/absence/absence-form-buttons";
import { absenceRequestAction } from "@/app/actions/absence-request-action";

interface AbsenceFormActionProps {
  numberOfEntries: number[];
  handleSuccess: () => void;
}

export default function AbsenceFormAction({
  numberOfEntries,
  handleSuccess,
}: AbsenceFormActionProps) {
  const dispatch = useAppDispatch();

  const [formState, formAction] = useFormState(absenceRequestAction, {
    numberOfEntries,
    notification: null,
  });

  // Handle formAction response
  useEffect(() => {
    if (formState.notification) {
      dispatch(uiActions.showNotification(formState.notification));

      if (formState.notification.status === "success") {
        handleSuccess();
      }
    }
  }, [formState]);

  return (
    <form id="absence_entries_form" action={formAction}>
      <AbsenceFormButtons />
    </form>
  );
}
