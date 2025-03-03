"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import { absenceRequestAction } from "@/server/actions/absence-request-action";

import BasicFormButtons from "@/app/_components/ui/basic-form/basic-form-buttons";

import { useAppDispatch } from "@/app/lib/hooks";
import { uiActions } from "@/app/lib/features/ui/uiSlice";

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
      <BasicFormButtons hrefBack="/absence" />
    </form>
  );
}
