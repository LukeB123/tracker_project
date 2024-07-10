"use client";

import { useState } from "react";

import ProjectDetailsDeleteModal from "@/app/_components/projects/project-details/project-details-table/project-details-delete-modal";
import ProjectDetailsHeader from "@/app/_components/projects/project-details/project-details-table/project-details-table-header";
import ProjectDetailsRow from "@/app/_components/projects/project-details/project-details-table/project-details-table-row";
import ProjectDetailsButtons from "@/app/_components/projects/project-details/project-details-table/project-details-table-buttons";

import { useAppSelector } from "@/lib/hooks";

interface ProjectDetailsTableParams {
  setIsEditing: any;
}

export default function ProjectDetailsTable({
  setIsEditing,
}: ProjectDetailsTableParams) {
  const project = useAppSelector((state) => state.projects.currentProject);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      {project && (
        <>
          <ProjectDetailsDeleteModal
            id={project.id}
            title={project.title}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
          />
          <ProjectDetailsHeader title={project?.title} />
          <div className="flex justify-center">
            <div className="flex flex-col w-1/3 min-w-128 gap-2">
              <ProjectDetailsRow
                label="Project Manager"
                value={project.project_manager}
              />
              <ProjectDetailsRow
                label="Delivery Manager"
                value={project.delivery_manager}
              />
              <ProjectDetailsRow
                label="Scrum Master"
                value={project.scrum_master}
              />
              <ProjectDetailsRow label="Task ID" value={project.task} />
              <ProjectDetailsRow
                label="Delivery Stream"
                value={project.delivery_stream}
              />
              <ProjectDetailsRow
                label="Value Stream"
                value={project.value_stream}
              />
              <ProjectDetailsRow
                label="Project Type"
                value={project.project_type}
              />
              <ProjectDetailsRow
                label="Line of Business"
                value={project.line_of_business}
              />
              <ProjectDetailsButtons
                setIsEditing={setIsEditing}
                setShowDeleteModal={setShowDeleteModal}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
