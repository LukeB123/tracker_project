"use client";

import { useFormStatus } from "react-dom";

import Button from "@/app/_components/buttons/button";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Icon from "@/app/_components/icons/icons";
import { useEffect } from "react";
import { formSatusActions } from "@/lib/formStatus";

interface ProjectDetailsFormButtonsParmas {
  context: "project" | "resource";
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing: any;
  changesMade: boolean;
  handleCancelEdit: any;
}

export default function TimeEntriesButtons({
  context,
  isLoading,
  isEditing,
  setIsEditing,
  changesMade,
  handleCancelEdit,
}: ProjectDetailsFormButtonsParmas) {
  const dispatch = useAppDispatch();

  const { pending } = useFormStatus();

  const project = useAppSelector((state) => state.projects.currentProject);

  useEffect(() => {
    dispatch(formSatusActions.setFormSatusIsPending(pending));
  }, [pending]);

  return (
    <>
      {isEditing && project && (
        <div className="mt-4 flex justify-center gap-8">
          <Button
            buttonStyle="secondary"
            disabled={pending || changesMade}
            onClick={handleCancelEdit}
            width={"w-20"}
          >
            Cancel
          </Button>
          <Button
            buttonStyle="secondary"
            disabled={pending || !changesMade}
            type="reset"
            width={"w-20"}
          >
            Reset
          </Button>
          <Button
            disabled={pending || !changesMade}
            type="submit"
            width={"w-32"}
          >
            {pending ? (
              <div className="flex justify-center items-center gap-2">
                <div className="animate-spin">
                  <Icon
                    iconName="loading"
                    color="#fafafa"
                    height="20px"
                    width="20px"
                  />
                </div>
                Submitting
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      )}
      {!isEditing && project && (
        <div className="mt-4 flex justify-center gap-8">
          <Button
            buttonStyle="secondary"
            href={
              context === "project" ? "/projects/" + project?.slug : undefined
            }
            width={"w-20"}
          >
            Back
          </Button>
          <Button
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            width={"w-20"}
          >
            Edit
          </Button>
        </div>
      )}
    </>
  );
}