"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import TimeEntriesButtons from "@/app/_components/time-entries/time-entries-buttons";

import {
  TNewProjectResourcesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
} from "@/util/time-entries";
import { projectTimeEntriesAction } from "@/util/time-entries-action";

import { uiActions } from "@/lib/ui";
import { useAppDispatch } from "@/lib/hooks";
import { TWeekProps } from "@/util/date";

interface ProjectTimeEntriesProps {
  context: "project" | "resource";
  projectResources: (TProjectResourcesProps | TNewProjectResourcesProps)[];
  initialProjectResourcesData: React.MutableRefObject<TProjectResourcesProps[]>;
  timeEntries: TTimeEntriesProps[];
  setTimeEntries: React.Dispatch<React.SetStateAction<TTimeEntriesProps[]>>;
  weeks: TWeekProps[];
  isEditing: boolean;
  isLoading: boolean;
  handleReset: () => void;
  handleCancelEdit: () => void;
  changesMade: boolean;
  setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TimeEntriesForm({
  context,
  projectResources,
  initialProjectResourcesData,
  timeEntries,
  setTimeEntries,
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
    weeks,
    notification: null,
  });

  // Handle formAction response
  useEffect(() => {
    if (formState.notification) {
      dispatch(uiActions.showNotification(formState.notification));

      initialProjectResourcesData.current = formState.projectResources.filter(
        (
          projectResource: TProjectResourcesProps | TNewProjectResourcesProps
        ): projectResource is TProjectResourcesProps =>
          projectResource !== undefined
      );

      setTimeEntries(formState.timeEntries);

      handleReset();

      if (formState.notification.status === "success") {
        setIsEditing(false);
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
