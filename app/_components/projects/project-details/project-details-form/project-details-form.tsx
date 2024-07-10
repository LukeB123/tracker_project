"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";

import { redirect } from "next/navigation";

import ProjectDetailsFormHeader from "@/app/_components/projects/project-details/project-details-form/project-details-form-header";
import ProjectDetailsFormRow from "@/app/_components/projects/project-details/project-details-form/project-details-form-row";
import ProjectDetailsFormButtons from "@/app/_components/projects/project-details/project-details-form/project-details-form-buttons";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { uiActions } from "@/lib/ui";

import { projectFormAction } from "@/util/project-actions";
import { TPeopleProps, getResources } from "@/util/people";
import { projectsActions } from "@/lib/projects";
import { TProjectDetailsProps } from "@/util/projects";

interface ProjectDetailsFormParams {
  setIsEditing?: any;
  newProject?: boolean;
}

const deliveryStreams = [
  { id: 1, name: "" },
  { id: 2, name: "Alaska" },
  { id: 3, name: "Arizona" },
  { id: 4, name: "Oregon" },
  { id: 5, name: "Nevada" },
];

const proposalTypes = [
  { id: 1, name: "" },
  { id: 2, name: "TM" },
  { id: 3, name: "FP" },
];

const lineOfBusinesses = [
  { id: 1, name: "" },
  { id: 2, name: "Project" },
  { id: 3, name: "Run" },
  { id: 4, name: "Opportunity" },
  { id: 5, name: "Innovation" },
];

export default function ProjectDetailsForm({
  setIsEditing = undefined,
  newProject = false,
}: ProjectDetailsFormParams) {
  const currentProjectState = useAppSelector(
    (state) => state.projects.currentProject
  );

  let project: TProjectDetailsProps | null = null;

  if (!newProject) {
    project = currentProjectState;
  }

  const dispatch = useAppDispatch();

  const [changesMade, setChangesMade] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState<
    { id: number; name: string }[] | undefined
  >();

  const [formState, formAction] = useFormState(projectFormAction, {
    project,
    notification: null,
    redirect: null,
  });

  useEffect(() => {
    async function fetchPeople() {
      setIsLoading(true);
      setError(false);
      try {
        const fetchedResources = await getResources();

        setResources(
          fetchedResources.map((resource) => {
            return { id: resource.id, name: resource.name };
          })
        );

        setError(false);
      } catch (error) {
        setError(true);
      }
      setIsLoading(false);
    }

    fetchPeople();
  }, []);

  useEffect(() => {
    if (formState.notification) {
      dispatch(uiActions.showNotification(formState.notification));
      if (formState.notification.status != "error") {
        setChangesMade(false);
        dispatch(projectsActions.setCurrentProject(formState.project));

        if (setIsEditing) {
          setIsEditing(false);
        }
      }
    }
    if (formState.redirect) {
      redirect(formState.redirect);
    }
  }, [formState]);

  let disableMessage: string = "";

  console.log("RENDERING FORM");

  if (!resources) disableMessage = "Fetching Resource Names...";

  if (error) disableMessage = "Error Fetching Resource Names";

  return (
    <form
      action={formAction}
      onChange={() => setChangesMade(true)}
      onReset={() => setChangesMade(false)}
    >
      <ProjectDetailsFormHeader
        title={project?.title}
        disableMessage={disableMessage}
        error={error}
      />
      <div className="flex justify-center">
        <div className="flex flex-col w-1/3 min-w-128 gap-2">
          <ProjectDetailsFormRow
            label="Project Manager"
            name="project_manager"
            type="dropdown"
            value={
              project
                ? {
                    id: project?.project_manager_id,
                    name: project?.project_manager,
                  }
                : undefined
            }
            selection={resources}
            search={true}
            changesMade={changesMade}
            setChangesMade={setChangesMade}
            isLoading={isLoading}
          />
          <ProjectDetailsFormRow
            label="Delivery Manager"
            name="delivery_manager"
            type="dropdown"
            value={
              project
                ? {
                    id: project?.delivery_manager_id,
                    name: project?.delivery_manager,
                  }
                : undefined
            }
            search={true}
            selection={resources}
            changesMade={changesMade}
            setChangesMade={setChangesMade}
            isLoading={isLoading}
          />
          <ProjectDetailsFormRow
            label="Scrum Master"
            name="scrum_master"
            type="dropdown"
            value={
              project
                ? { id: project?.scrum_master_id, name: project?.scrum_master }
                : undefined
            }
            search={true}
            selection={resources}
            changesMade={changesMade}
            setChangesMade={setChangesMade}
            isLoading={isLoading}
          />
          <ProjectDetailsFormRow
            label="Task ID"
            name="task"
            type="text"
            value={project?.task}
            uppercase
          />
          <ProjectDetailsFormRow
            label="Delivery Stream"
            name="delivery_stream"
            type="dropdown"
            value={project?.delivery_stream}
            selectedId={
              deliveryStreams.find(
                (deliveryStream) =>
                  deliveryStream.name === project?.delivery_stream
              )?.id
            }
            selection={deliveryStreams}
            changesMade={changesMade}
            setChangesMade={setChangesMade}
          />
          <ProjectDetailsFormRow
            label="Value Stream"
            name="value_stream"
            type="text"
            value={project?.value_stream}
            capitalise
          />
          <ProjectDetailsFormRow
            label="Project Type"
            name="project_type"
            type="dropdown"
            value={project?.project_type}
            selectedId={
              proposalTypes.find(
                (proposalType) => proposalType.name === project?.project_type
              )?.id
            }
            selection={proposalTypes}
            changesMade={changesMade}
            setChangesMade={setChangesMade}
          />
          <ProjectDetailsFormRow
            label="Line of Business"
            name="line_of_business"
            type="dropdown"
            value={project?.line_of_business}
            selectedId={
              lineOfBusinesses.find(
                (lineOfBusiness) =>
                  lineOfBusiness.name === project?.line_of_business
              )?.id
            }
            selection={lineOfBusinesses}
            changesMade={changesMade}
            setChangesMade={setChangesMade}
          />
          <ProjectDetailsFormButtons
            disabled={!resources}
            newProject={project === null}
            changesMade={changesMade}
            setChangesMade={setChangesMade}
            setIsEditing={setIsEditing}
          />
        </div>
      </div>
    </form>
  );
}
