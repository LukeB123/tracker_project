"use client";

import { useFormStatus } from "react-dom";
import Button from "@/app/_components/buttons/button";
import Icon from "@/app/_components/icons/icons";

interface ProjectDetailsFormButtonsParmas {
  newProject: boolean;
  changesMade: boolean;
  setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}
export default function ProjectDetailsFormButtons({
  newProject,
  changesMade,
  setChangesMade,
  setIsEditing,
  disabled = false,
}: ProjectDetailsFormButtonsParmas) {
  const { pending } = useFormStatus();

  function handleClick() {
    setChangesMade(false);
    setIsEditing && setIsEditing(false);
  }

  let cancelAction: {
    href: string | undefined;
    onClick: (() => void) | undefined;
  } = { href: "/projects/", onClick: handleClick };

  if (newProject) {
    cancelAction.onClick = undefined;
  } else {
    cancelAction.href = undefined;
  }

  return (
    <div className="mt-4 flex justify-center gap-8">
      <Button
        buttonStyle="secondary"
        disabled={pending}
        href={cancelAction.href}
        onClick={cancelAction.onClick}
        width={"w-20"}
      >
        Cancel
      </Button>
      <Button
        buttonStyle="secondary"
        disabled={pending || !changesMade || disabled}
        type="reset"
        width={"w-20"}
      >
        Reset
      </Button>
      <Button
        disabled={pending || !changesMade || disabled}
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
  );
}
