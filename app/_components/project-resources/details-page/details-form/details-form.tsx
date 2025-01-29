"use client";

import { useFormState } from "react-dom";
import React, { useEffect, useState } from "react";

import { redirect } from "next/navigation";

import DetailsFormHeader from "@/app/_components/project-resources/details-page/details-form/details-form-header";
import DetailsFormRow from "@/app/_components/project-resources/details-page/details-form/details-form-row";
import DetailsFormButtons from "@/app/_components/project-resources/details-page/details-form/details-form-buttons";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { uiActions } from "@/lib/features/ui/uiSlice";

import { detailsFormAction } from "@/app/actions/details-form-actions";
import {
  TResourceProps,
  TRole,
  getResources,
  getRoles,
} from "@/util/resources";
import { projectsActions } from "@/lib/features/project/projectsSlice";
import { TProjectDetailsProps } from "@/util/projects";
import { resourcesActions } from "@/lib/features/resources/resourcesSlice";

interface DetailsFormParams {
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  newProjectResource?: boolean;
  context: "project" | "resource";
}

const deliveryStreams = [
  { id: 1, name: "" },
  { id: 2, name: "Delivery Stream 1" },
  { id: 3, name: "Delivery Stream 2" },
  { id: 4, name: "Delivery Stream 3" },
  { id: 5, name: "Delivery Stream 4" },
];

const proposalTypes = [
  { id: 1, name: "" },
  { id: 2, name: "Timed" },
  { id: 3, name: "Fixed" },
];

const lineOfBusinesses = [
  { id: 1, name: "" },
  { id: 2, name: "Project" },
  { id: 3, name: "Service" },
  { id: 4, name: "Opportunity" },
];

const grades = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
  { id: 7, name: "7" },
];

const teams = [{ id: 1, name: "Marvel" }];

export default function DetailsForm({
  setIsEditing,
  newProjectResource = false,
  context,
}: DetailsFormParams) {
  let project: TProjectDetailsProps | null = null;

  let resource: TResourceProps | null = null;

  if (!newProjectResource) {
    if (context === "project")
      project = useAppSelector((state) => state.projects.currentProject);

    if (context === "resource")
      resource = useAppSelector((state) => state.resources.currentResource);
  }

  const dispatch = useAppDispatch();

  const [changesMade, setChangesMade] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState<TResourceProps[] | undefined>();
  const [roles, setRoles] = useState<TRole[] | undefined>();

  const [formState, formAction] = useFormState(detailsFormAction, {
    context,
    project,
    resource,
    notification: null,
    redirect: null,
  });

  useEffect(() => {
    async function fetchOptions() {
      setIsLoading(true);
      setError(false);
      try {
        if (context === "project") {
          const fetchedResources = await getResources();

          setResources(fetchedResources);
        } else if (context === "resource") {
          const fetchedRoles = await getRoles();

          setRoles(fetchedRoles);
        }

        setError(false);
      } catch (error) {
        setError(true);
      }
      setIsLoading(false);
    }

    fetchOptions();
  }, []);

  useEffect(() => {
    if (formState.notification) {
      dispatch(uiActions.showNotification(formState.notification));
      if (formState.notification.status != "error") {
        setChangesMade(false);

        if (context === "project")
          dispatch(projectsActions.setCurrentProject(formState.project));

        if (context === "resource")
          dispatch(resourcesActions.setCurrentResource(formState.resource));

        if (setIsEditing) {
          setIsEditing(false);
        }
      }
    }
    if (formState.redirect) {
      redirect(formState.redirect);
    }
  }, [formState]);

  return (
    <form
      id="detailsInput"
      action={formAction}
      onChange={() => setChangesMade(true)}
      onReset={() => setChangesMade(false)}
    >
      <DetailsFormHeader
        title={context === "project" ? project?.title : resource?.name}
        context={context}
      />
      <div className="flex justify-center">
        {context === "project" && (
          <div className="flex flex-col w-1/3 min-w-128 gap-2">
            <DetailsFormRow
              label="Project Manager"
              name="project_manager"
              type="dropdown"
              form="detailsInput"
              value={project?.project_manager}
              dropdownSelection={resources
                ?.filter((resource) => resource.is_project_manager)
                .map((resource) => {
                  return { id: resource.id, name: resource.name };
                })}
              searchableDropdown={true}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
              isLoading={isLoading}
            />
            <DetailsFormRow
              label="Delivery Manager"
              name="delivery_manager"
              type="dropdown"
              form="detailsInput"
              value={project?.delivery_manager}
              searchableDropdown={true}
              dropdownSelection={resources
                ?.filter((resource) => resource.is_delivery_manager)
                .map((resource) => {
                  return { id: resource.id, name: resource.name };
                })}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
              isLoading={isLoading}
            />
            <DetailsFormRow
              label="Scrum Master"
              name="scrum_master"
              type="dropdown"
              form="detailsInput"
              value={project?.scrum_master}
              searchableDropdown={true}
              dropdownSelection={resources
                ?.filter((resource) => resource.is_scrum_master)
                .map((resource) => {
                  return { id: resource.id, name: resource.name };
                })}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
              isLoading={isLoading}
            />
            <DetailsFormRow
              label="Task ID"
              name="task"
              type="text"
              form="detailsInput"
              value={project?.task}
            />
            <DetailsFormRow
              label="Delivery Stream"
              name="delivery_stream"
              type="dropdown"
              form="detailsInput"
              value={project?.delivery_stream}
              dropdownSelection={deliveryStreams}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
            />
            <DetailsFormRow
              label="Value Stream"
              name="value_stream"
              type="text"
              form="detailsInput"
              value={project?.value_stream}
            />
            <DetailsFormRow
              label="Project Type"
              name="project_type"
              type="dropdown"
              form="detailsInput"
              value={project?.project_type}
              dropdownSelection={proposalTypes}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
            />
            <DetailsFormRow
              label="Line of Business"
              name="line_of_business"
              type="dropdown"
              form="detailsInput"
              value={project?.line_of_business}
              dropdownSelection={lineOfBusinesses}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
            />
            <DetailsFormButtons
              disabled={!resources}
              newProjectResource={newProjectResource}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
              setIsEditing={setIsEditing}
              context={context}
            />
          </div>
        )}
        {context === "resource" && (
          <div className="flex flex-col w-1/3 min-w-128 gap-2">
            <DetailsFormRow
              label="Email"
              name="email"
              type="email"
              form="detailsInput"
              value={resource?.email}
            />
            <DetailsFormRow
              label="Team"
              name="team"
              type="dropdown"
              form="detailsInput"
              value={resource?.team}
              dropdownSelection={teams}
              searchableDropdown={true}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
            />
            <DetailsFormRow
              label="Role"
              name="role"
              type="dropdown"
              form="detailsInput"
              value={resource?.role}
              searchableDropdown={true}
              dropdownSelection={roles?.map((role) => {
                return { id: role.id, name: role.role };
              })}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
              isLoading={isLoading}
            />
            <DetailsFormRow
              label="Grade"
              name="grade"
              type="dropdown"
              form="detailsInput"
              value={resource?.grade}
              searchableDropdown={true}
              dropdownSelection={grades}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
            />
            <DetailsFormRow
              label="Is Delivery Manager"
              name="is_delivery_manager"
              type="dropdown"
              form="detailsInput"
              value={resource?.is_delivery_manager === 1 ? "TRUE" : "FALSE"}
              dropdownSelection={[
                { id: 1, name: "FALSE" },
                { id: 2, name: "TRUE" },
              ]}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
            />
            <DetailsFormRow
              label="Is Project Manager"
              name="is_project_manager"
              type="dropdown"
              form="detailsInput"
              value={resource?.is_project_manager === 1 ? "TRUE" : "FALSE"}
              dropdownSelection={[
                { id: 1, name: "FALSE" },
                { id: 2, name: "TRUE" },
              ]}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
            />
            <DetailsFormRow
              label="Is Scrum Master"
              name="is_scrum_master"
              type="dropdown"
              form="detailsInput"
              value={resource?.is_scrum_master === 1 ? "TRUE" : "FALSE"}
              dropdownSelection={[
                { id: 1, name: "FALSE" },
                { id: 2, name: "TRUE" },
              ]}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
            />
            <DetailsFormButtons
              disabled={!roles}
              newProjectResource={newProjectResource}
              changesMade={changesMade}
              setChangesMade={setChangesMade}
              setIsEditing={setIsEditing}
              context={context}
            />
          </div>
        )}
      </div>
    </form>
  );
}
