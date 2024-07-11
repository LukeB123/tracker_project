"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import { uiActions } from "@/lib/ui";
import { useAppDispatch } from "@/lib/hooks";
import BaselineFormButtons from "@/app/_components/baseline/baseline-form-buttons";
import { baselineEntriesAction } from "@/util/baseline-entries-action";

interface BaselineFormProps {
  numberOfEntries: number;
  handleReset: () => void;
}

export default function BaselineForm({
  numberOfEntries,
  handleReset,
}: BaselineFormProps) {
  const dispatch = useAppDispatch();

  const [formState, formAction] = useFormState(baselineEntriesAction, {
    numberOfEntries: numberOfEntries,
    notification: null,
  });

  // Handle formAction response
  useEffect(() => {
    if (formState.notification) {
      dispatch(uiActions.showNotification(formState.notification));

      if (formState.notification.status === "success") {
        handleReset();
      }
    }
  }, [formState]);

  return (
    <form id="baseline_entries_form" action={formAction}>
      <BaselineFormButtons />
    </form>
  );
}
