"use server";

import {
  addProject,
  updateProject,
  TProjectDetailsProps,
  checkSlugUniquness,
  deleteProject,
  TNewProjectDetailsProps,
} from "@/util/projects";

import { revalidatePath } from "next/cache";

import { TNotificationState } from "@/lib/ui";
import { getResources } from "./resources";
import {
  deleteProjectResourcesByProjectId,
  updateProjectResourcesProjectTitle,
} from "./time-entries";

interface TFormState {
  project: TProjectDetailsProps | TNewProjectDetailsProps | null;
  notification: TNotificationState | null;
  redirect: string | null;
}

function isInvalidText(text: string): boolean {
  return !text || text.trim() === "";
}

export async function projectFormAction(
  prevState: TFormState,
  formData: any
): Promise<TFormState> {
  const currentProject = prevState.project;

  const formInputValues: TNewProjectDetailsProps = {
    slug: formData.get("title").trim().toLowerCase().replaceAll(" ", "-"),
    title: formData.get("title").trim(),
    delivery_manager: formData.get("delivery_manager"),
    delivery_manager_id: formData.get("delivery_manager_id"),
    project_manager: formData.get("project_manager"),
    project_manager_id: formData.get("project_manager_id"),
    scrum_master: formData.get("scrum_master"),
    scrum_master_id: formData.get("scrum_master_id"),
    delivery_stream: formData.get("delivery_stream"),
    value_stream: formData.get("value_stream").trim(),
    project_type: formData.get("project_type"),
    last_updated: undefined,
    line_of_business: formData.get("line_of_business"),
    task: formData.get("task").trim(),
  };

  // Check if there are any nulls in the project detail
  if (
    isInvalidText(formInputValues.title) ||
    formInputValues.delivery_manager_id === undefined ||
    formInputValues.project_manager_id === undefined ||
    formInputValues.scrum_master_id === undefined ||
    formInputValues.delivery_stream === undefined ||
    isInvalidText(formInputValues.value_stream) ||
    formInputValues.project_type === undefined ||
    formInputValues.line_of_business === undefined ||
    isInvalidText(formInputValues.task)
  ) {
    return {
      project: currentProject,
      notification: {
        status: "error",
        title: "Project Details Input",
        message: "Invalid Input, Please Fill Out Every Input.",
      },
      redirect: null,
    };
  }

  // Check if there are any changes to the project detail
  if (
    currentProject &&
    formInputValues.title === currentProject.title &&
    formInputValues.delivery_manager_id ===
      currentProject.delivery_manager_id &&
    formInputValues.project_manager_id === currentProject.project_manager_id &&
    formInputValues.scrum_master_id === currentProject.scrum_master_id &&
    formInputValues.delivery_stream === currentProject.delivery_stream &&
    formInputValues.value_stream === currentProject.value_stream &&
    formInputValues.project_type === currentProject.project_type &&
    formInputValues.line_of_business === currentProject.line_of_business &&
    formInputValues.task === currentProject.task
  ) {
    return {
      project: currentProject,
      notification: {
        status: "neutral",
        title: "Project Details Input",
        message: "No Change Detected.",
      },
      redirect: null,
    };
  }

  // Check that the project title dosen't already exist
  const isUnique = await checkSlugUniquness(
    currentProject && "id" in currentProject ? currentProject.id : null,
    formInputValues.slug
  );

  if (!isUnique) {
    return {
      project: currentProject,
      notification: {
        status: "error",
        title: "Project Details Input",
        message: "Project Already Exists.",
      },
      redirect: null,
    };
  }

  // TODO -- Handle names, use dropdowns instead of user input to fix this
  const people = await getResources();

  const names = people.map((person) => person.name);

  // const containsUnknownResource =
  //   !names.includes(formInputValues.delivery_manager) ||
  //   !names.includes(formInputValues.project_manager) ||
  //   !names.includes(formInputValues.scrum_master);

  try {
    if (!currentProject || !("id" in currentProject)) {
      // NEW PROJECT INSERT
      await addProject(formInputValues);
      revalidatePath("/projects/");

      // if (containsUnknownResource) {
      //   return {
      //     project: formInputValues,
      //     notification: {
      //       status: "neutral",
      //       title: "Project Details Input",
      //       message:
      //         "Project Updated Successfully, But With Unknown Resources, Redirecting To New Endpoint.",
      //     },
      //     redirect: `/projects/${formInputValues.slug}/`,
      //   };
      // }

      return {
        project: formInputValues,
        notification: {
          status: "success",
          title: "Project Details Input",
          message: "Project Updated Successfully, Redirecting To New Endpoint.",
        },
        redirect: `/projects/${formInputValues.slug}/`,
      };
    } else {
      // Updating Existing Project
      const updatedProject: TProjectDetailsProps = {
        id: currentProject.id,
        slug: formInputValues.slug,
        title: formInputValues.title,
        delivery_manager: formInputValues.delivery_manager,
        delivery_manager_id: formInputValues.delivery_manager_id,
        project_manager: formInputValues.project_manager,
        project_manager_id: formInputValues.project_manager_id,
        scrum_master: formInputValues.scrum_master,
        scrum_master_id: formInputValues.scrum_master_id,
        delivery_stream: formInputValues.delivery_stream,
        value_stream: formInputValues.value_stream,
        project_type: formInputValues.project_type,
        line_of_business: formInputValues.line_of_business,
        task: formInputValues.task,
        last_updated: "placeHolderString",
      };

      const renamedProject = currentProject.slug !== updatedProject.slug;

      await updateProject(updatedProject);
      revalidatePath("/projects/");

      if (renamedProject) {
        await updateProjectResourcesProjectTitle(
          currentProject.id,
          updatedProject.slug,
          updatedProject.title
        );
        // Changed the title of the project
        // if (containsUnknownResource) {
        //   return {
        //     project: updatedProject,
        //     notification: {
        //       status: "neutral",
        //       title: "Project Details Input",
        //       message:
        //         "Project Updated Successfully, But With Unknown Resources, Redirecting To New Endpoint.",
        //     },
        //     redirect: `/projects/${updatedProject.slug}/`,
        //   };
        // }
        return {
          project: updatedProject,
          notification: {
            status: "success",
            title: "Project Details Input",
            message:
              "Project Updated Successfully, Redirecting To New Endpoint.",
          },
          redirect: `/projects/${updatedProject.slug}/`,
        };
      }

      // if (containsUnknownResource) {
      //   return {
      //     project: updatedProject,
      //     notification: {
      //       status: "neutral",
      //       title: "Project Details Input",
      //       message:
      //         "Project Updated Successfully, But With Unknown Resources.",
      //     },
      //     redirect: null,
      //   };
      // }

      return {
        project: updatedProject,
        notification: {
          status: "success",
          title: "Project Details Input",
          message: "Project Updated Successfully.",
        },
        redirect: null,
      };
    }
  } catch (error) {
    return {
      project: currentProject,
      notification: {
        status: "error",
        title: "Project Details Input",
        message: "Error with Database.",
      },
      redirect: null,
    };
  }
}

interface TDeleteProject {
  notification: TNotificationState;
  redirect: string | null;
}

export async function deleteProjectAction(id: number): Promise<TDeleteProject> {
  try {
    await deleteProject(id);
    await deleteProjectResourcesByProjectId(id);
    revalidatePath("/projects/");

    return {
      notification: {
        status: "success",
        title: "Project Details Delete",
        message: "Project deleted successfully",
      },
      redirect: "/projects/",
    };
  } catch (error) {
    console.log(error);

    return {
      notification: {
        status: "error",
        title: "Project Details Delete",
        message: "Error deleting project!",
      },
      redirect: null,
    };
  }
}
