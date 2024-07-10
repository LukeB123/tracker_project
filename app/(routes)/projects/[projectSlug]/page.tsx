"use client";

import { useState } from "react";
import ProjectDetailsTable from "@/app/_components/projects/project-details/project-details-table/project-details-table";
import ProjectDetailsForm from "@/app/_components/projects/project-details/project-details-form/project-details-form";

export default function ProjectDetailsPage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {!isEditing && <ProjectDetailsTable setIsEditing={setIsEditing} />}
      {isEditing && <ProjectDetailsForm setIsEditing={setIsEditing} />}
    </>
  );
}
