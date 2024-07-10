"use client";

import Button from "@/app/_components/buttons/button";

interface ProjectDetailsTableButtonsParmas {
  setIsEditing: any;
  setShowDeleteModal: any;
}
export default function ProjectDetailsFormButtons({
  setIsEditing,
  setShowDeleteModal,
}: ProjectDetailsTableButtonsParmas) {
  return (
    <div className="mt-4 flex justify-center gap-8">
      <Button buttonStyle="secondary" href="/projects/" width={"w-20"}>
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
