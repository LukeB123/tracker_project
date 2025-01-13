"use client";

import { useState } from "react";
import DetailsTable from "@/app/_components/project-resources/details-page/details-table/details-table";
import DetailsForm from "@/app/_components/project-resources/details-page/details-form/details-form";

interface DetailsPageParams {
  context: "project" | "resource";
}

export default function DetailsPage({ context }: DetailsPageParams) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {!isEditing && (
        <DetailsTable setIsEditing={setIsEditing} context={context} />
      )}
      {isEditing && (
        <DetailsForm setIsEditing={setIsEditing} context={context} />
      )}
    </>
  );
}
