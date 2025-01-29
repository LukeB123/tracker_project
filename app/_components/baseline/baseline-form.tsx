"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import { uiActions } from "@/lib/features/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import BaselineFormButtons from "@/app/_components/baseline/baseline-form-buttons";
import { baselineEntriesAction } from "@/app/actions/baseline-entries-action";
import { TWeekProps } from "@/util/date";

interface BaselineFormProps {
  numberOfEntries: number[];
  handleSuccess: () => void;
  weeks: TWeekProps[];
}

export default function BaselineForm({
  numberOfEntries,
  handleSuccess,
  weeks,
}: BaselineFormProps) {
  const dispatch = useAppDispatch();

  const project = useAppSelector((state) => state.projects.currentProject)!;

  const [formState, formAction] = useFormState(baselineEntriesAction, {
    project,
    weeks,
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
    <form id="baseline_entries_form" action={formAction}>
      <BaselineFormButtons />
    </form>
  );
}
