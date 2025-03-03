"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import { baselineEntriesAction } from "@/server/actions/baseline-entries-action";
import { TWeekProps } from "@/server/actions/data-fetches";

import BasicFormButtons from "@/app/_components/ui/basic-form/basic-form-buttons";

import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { uiActions } from "@/app/lib/features/ui/uiSlice";

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
      <BasicFormButtons hrefBack={"/projects/" + project.slug} />
    </form>
  );
}
