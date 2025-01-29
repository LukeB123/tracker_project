"use client";

import { useState } from "react";

import DetailsDeleteModal from "@/app/_components/project-resources/details-page/details-table/details-delete-modal";
import DetailsTableHeader from "@/app/_components/project-resources/details-page/details-table/details-table-header";
import DetailsTableRow from "@/app/_components/project-resources/details-page/details-table/details-table-row";
import DetailsTableButtons from "@/app/_components/project-resources/details-page/details-table/details-table-buttons";

import { useAppSelector } from "@/lib/hooks";

interface ProjectDetailsTableParams {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  context: "project" | "resource";
}

export default function DetailsTable({
  setIsEditing,
  context,
}: ProjectDetailsTableParams) {
  const project = useAppSelector((state) => state.projects.currentProject);

  const resource = useAppSelector((state) => state.resources.currentResource);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      {context === "project" && project && (
        <>
          <DetailsDeleteModal
            id={project.id}
            title={project.title}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            context={context}
          />
          <DetailsTableHeader title={project.title} />
          <div className="flex justify-center">
            <div className="flex flex-col w-1/3 min-w-128 gap-2">
              <DetailsTableRow
                label="Project Manager"
                value={project.project_manager}
              />
              <DetailsTableRow
                label="Delivery Manager"
                value={project.delivery_manager}
              />
              <DetailsTableRow
                label="Scrum Master"
                value={project.scrum_master}
              />
              <DetailsTableRow label="Task ID" value={project.task} />
              <DetailsTableRow
                label="Delivery Stream"
                value={project.delivery_stream}
              />
              <DetailsTableRow
                label="Value Stream"
                value={project.value_stream}
              />
              <DetailsTableRow
                label="Project Type"
                value={project.project_type}
              />
              <DetailsTableRow
                label="Line of Business"
                value={project.line_of_business}
              />
            </div>
          </div>
        </>
      )}
      {context === "resource" && resource && (
        <>
          <DetailsDeleteModal
            id={resource.id}
            title={resource.name}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            context={context}
          />
          <DetailsTableHeader title={resource.name} />
          <div className="flex justify-center">
            <div className="flex flex-col w-1/3 min-w-128 gap-2">
              <DetailsTableRow label="Email" value={resource.email} />
              <DetailsTableRow label="Team" value={resource.team} />
              <DetailsTableRow label="Role" value={resource.role} />
              <DetailsTableRow label="Grade" value={resource.grade} />
              <DetailsTableRow
                label="Is Delivery Manager"
                value={resource.is_delivery_manager === 1 ? "TRUE" : "FALSE"}
              />
              <DetailsTableRow
                label="Is Project Manager"
                value={resource.is_project_manager === 1 ? "TRUE" : "FALSE"}
              />
              <DetailsTableRow
                label="Is Scrum Master"
                value={resource.is_scrum_master === 1 ? "TRUE" : "FALSE"}
              />
            </div>
          </div>
        </>
      )}
      <DetailsTableButtons
        setIsEditing={setIsEditing}
        setShowDeleteModal={setShowDeleteModal}
        context={context}
      />
    </>
  );
}
