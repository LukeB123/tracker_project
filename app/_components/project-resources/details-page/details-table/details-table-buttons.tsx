"use client";

import Button from "@/app/_components/buttons/button";

interface ProjectDetailsTableButtonsParmas {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  context: "project" | "resource";
}
export default function DetailsFormButtons({
  setIsEditing,
  setShowDeleteModal,
  context,
}: ProjectDetailsTableButtonsParmas) {
  return (
    <div className="mt-4 flex justify-center gap-8">
      <Button buttonStyle="secondary" href={`/${context}s/`} width={"w-20"}>
        Back
      </Button>
      <Button onClick={() => setIsEditing(true)} width={"w-20"}>
        Edit
      </Button>
      <Button onClick={() => setShowDeleteModal(true)} width={"w-20"}>
        Delete
      </Button>
    </div>
  );
}
