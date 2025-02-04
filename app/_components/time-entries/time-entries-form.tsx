"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import TimeEntriesButtons from "@/app/_components/time-entries/time-entries-buttons";

import { projectTimeEntriesAction } from "@/server/actions/time-entries-action";

import { uiActions } from "@/app/lib/features/ui/uiSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import {
  TNewProjectResourcesProps,
  TNewTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
  TWeekProps,
} from "@/server/actions/data-fetches";

interface ProjectTimeEntriesProps {
  context: "project" | "resource";
  projectResources: (TProjectResourcesProps | TNewProjectResourcesProps)[];
  initialProjectResourcesData: React.MutableRefObject<TProjectResourcesProps[]>;
  timeEntries: (TTimeEntriesProps | TNewTimeEntriesProps)[];
  initialTimeEntriesData: React.MutableRefObject<TTimeEntriesProps[]>;
  weeks: TWeekProps[];
  isEditing: boolean;
  isLoading: boolean;
  handleReset: () => void;
  handleCancelEdit: () => void;
  changesMade: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TimeEntriesForm({
  context,
  projectResources,
  initialProjectResourcesData,
  timeEntries,
  initialTimeEntriesData,
  weeks,
  isEditing,
  isLoading,
  handleReset,
  handleCancelEdit,
  changesMade,
  setIsEditing,
}: ProjectTimeEntriesProps) {
  const dispatch = useAppDispatch();

  const [formState, formAction] = useFormState(projectTimeEntriesAction, {
    context,
    projectResources,
    initialProjectResources: initialProjectResourcesData.current,
    timeEntries,
    initialTimeEntries: initialTimeEntriesData.current,
    weeks,
    notification: null,
  });

  // Handle formAction response
  useEffect(() => {
    if (formState.notification) {
      dispatch(uiActions.showNotification(formState.notification));

      if (formState.notification.status === "success") {
        initialProjectResourcesData.current = formState.initialProjectResources;

        initialTimeEntriesData.current = formState.initialTimeEntries;

        handleReset();
        setIsEditing(false);
      }

      if (formState.notification.message === "No Changes Detected") {
        handleReset();
      }
    }
  }, [formState]);

  return (
    <form id="time_entries_form" onReset={handleReset} action={formAction}>
      <TimeEntriesButtons
        context={context}
        isLoading={isLoading}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        changesMade={changesMade}
        handleCancelEdit={handleCancelEdit}
      />
    </form>
  );
}
