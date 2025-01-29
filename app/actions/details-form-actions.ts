"use server";

import { revalidatePath } from "next/cache";

import { TNotificationState } from "@/lib/features/ui/uiSlice";

import {
  addProject,
  updateProject,
  deleteProject,
  checkProjectSlugUniquness,
  TProjectDetailsProps,
  TNewProjectDetailsProps,
} from "@/util/projects";

import {
  addResource,
  updateResource,
  deleteResource,
  checkResourceSlugUniquness,
  TNewResourceProps,
  TResourceProps,
  checkResourceEmailUniquness,
} from "@/util/resources";

import {
  deleteProjectResourcesByProjectId,
  deleteProjectResourcesByResourceId,
  updateProjectResourcesProjectTitle,
  updateProjectResourcesResourceName,
} from "@/util/time-entries";

interface TFormState {
  context: "project" | "resource";
  project: TProjectDetailsProps | TNewProjectDetailsProps | null;
  resource: TResourceProps | TNewResourceProps | null;
  notification: TNotificationState | null;
  redirect: string | null;
}

function isInvalidText(text: string): boolean {
  return !text || text.trim() === "";
}

function validEmail(email: string) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export async function detailsFormAction(
  prevState: TFormState,
  formData: FormData
): Promise<TFormState> {
  if (prevState.context === "project") {
    const currentProject = prevState.project;

    const formNotification: TNotificationState = {
      status: "error",
      title: "Project Details Form",
      message: "Error with Database.",
    };

    // Collect form inputs
    const formInputValues: TNewProjectDetailsProps = {
      slug: (formData.get("title") as string)
        .trim()
        .toLowerCase()
        .replaceAll(" ", "-"),
      title: (formData.get("title") as string).trim(),
      delivery_manager: formData.get("delivery_manager") as string,
      delivery_manager_id: +(formData.get("delivery_manager_id") as string),
      project_manager: formData.get("project_manager") as string,
      project_manager_id: +(formData.get("project_manager_id") as string),
      scrum_master: formData.get("scrum_master") as string,
      scrum_master_id: +(formData.get("scrum_master_id") as string),
      delivery_stream: formData.get("delivery_stream") as string,
      value_stream: (formData.get("value_stream") as string).trim(),
      project_type: formData.get("project_type") as string,
      last_updated: "",
      line_of_business: formData.get("line_of_business") as string,
      task: (formData.get("task") as string).trim(),
    };

    // Check if there are any empty inputs
    if (
      isInvalidText(formInputValues.title) ||
      formInputValues.delivery_manager_id === 0 ||
      formInputValues.project_manager_id === 0 ||
      formInputValues.scrum_master_id === 0 ||
      isInvalidText(formInputValues.delivery_stream) ||
      isInvalidText(formInputValues.value_stream) ||
      isInvalidText(formInputValues.project_type) ||
      isInvalidText(formInputValues.line_of_business) ||
      isInvalidText(formInputValues.task)
    ) {
      formNotification.message = "Invalid Input, Please Fill Out Every Input.";

      return {
        ...prevState,
        notification: formNotification,
      };
    }

    // Check if there are any changes to the project detail
    if (
      currentProject &&
      formInputValues.title === currentProject.title &&
      formInputValues.delivery_manager_id ===
        currentProject.delivery_manager_id &&
      formInputValues.project_manager_id ===
        currentProject.project_manager_id &&
      formInputValues.scrum_master_id === currentProject.scrum_master_id &&
      formInputValues.delivery_stream === currentProject.delivery_stream &&
      formInputValues.value_stream === currentProject.value_stream &&
      formInputValues.project_type === currentProject.project_type &&
      formInputValues.line_of_business === currentProject.line_of_business &&
      formInputValues.task === currentProject.task
    ) {
      formNotification.status = "neutral";
      formNotification.message = "No Change Detected.";

      return {
        ...prevState,
        notification: formNotification,
      };
    }

    // Check that the project title dosen't already exist
    const isUnique = await checkProjectSlugUniquness(
      currentProject && "id" in currentProject ? currentProject.id : null,
      formInputValues.slug
    );

    if (!isUnique) {
      formNotification.message = "Project Already Exists.";

      return {
        ...prevState,
        notification: formNotification,
      };
    }

    try {
      if (!currentProject || !("id" in currentProject)) {
        // NEW PROJECT INSERT

        await addProject(formInputValues);
        revalidatePath("/projects/");

        formNotification.status = "success";
        formNotification.message =
          "Project Updated Successfully, Redirecting To New Endpoint.";

        return {
          ...prevState,
          project: formInputValues,
          notification: formNotification,
          redirect: `/projects/${formInputValues.slug}/`,
        };
      } else {
        // Update Existing Project

        const formInputValuesWithId: TProjectDetailsProps = {
          id: currentProject.id,
          ...formInputValues,
        };

        await updateProject(formInputValuesWithId);
        revalidatePath("/projects/");

        formNotification.status = "success";

        // Changed the title of the project
        if (currentProject.slug !== formInputValuesWithId.slug) {
          await updateProjectResourcesProjectTitle(
            currentProject.id,
            formInputValuesWithId.slug,
            formInputValuesWithId.title
          );

          formNotification.message =
            "Project Updated Successfully, Redirecting To New Endpoint.";

          return {
            ...prevState,
            project: formInputValuesWithId,
            notification: formNotification,
            redirect: `/projects/${formInputValuesWithId.slug}/`,
          };
        }

        formNotification.message = "Project Updated Successfully.";

        return {
          ...prevState,
          project: formInputValuesWithId,
          notification: formNotification,
        };
      }
    } catch (error) {
      return {
        ...prevState,
        project: currentProject,
        notification: formNotification,
      };
    }
  }

  if (prevState.context === "resource") {
    const currentResource = prevState.resource;

    const formNotification: TNotificationState = {
      status: "error",
      title: "Resource Details Form",
      message: "Error with Database.",
    };

    // Collect form inputs
    const formInputValues: TNewResourceProps = {
      slug: (formData.get("title") as string)
        .trim()
        .toLowerCase()
        .replaceAll(" ", "-"),
      name: (formData.get("title") as string).trim(),
      email: (formData.get("email") as string).trim(),
      team: formData.get("team") as string,
      role: formData.get("role") as string,
      role_id: +(formData.get("role_id") as string),
      grade: formData.get("grade") as string,
      is_delivery_manager:
        (formData.get("is_delivery_manager") as string) === "TRUE" ? 1 : 0,
      is_project_manager:
        (formData.get("is_project_manager") as string) === "TRUE" ? 1 : 0,
      is_scrum_master:
        (formData.get("is_scrum_master") as string) === "TRUE" ? 1 : 0,
    };

    // Check if there are any empty inputs
    if (
      isInvalidText(formInputValues.name) ||
      isInvalidText(formInputValues.email) ||
      isInvalidText(formInputValues.team) ||
      formInputValues.role_id === 0 ||
      isInvalidText(formInputValues.grade)
    ) {
      formNotification.message = "Invalid Input, Please Fill Out Every Input.";

      return {
        ...prevState,
        notification: formNotification,
      };
    }

    // Check if email is valid
    if (!validEmail(formInputValues.email)) {
      formNotification.message = "Please Enter a Valid Email Address.";

      return {
        ...prevState,
        notification: formNotification,
      };
    }

    // Check if there are any changes to the resource detail
    if (
      currentResource &&
      formInputValues.name === currentResource.name &&
      formInputValues.email === currentResource.email &&
      formInputValues.team === currentResource.team &&
      formInputValues.role_id === currentResource.role_id &&
      formInputValues.grade === currentResource.grade &&
      formInputValues.is_delivery_manager ===
        currentResource.is_delivery_manager &&
      formInputValues.is_project_manager ===
        currentResource.is_project_manager &&
      formInputValues.is_scrum_master === currentResource.is_scrum_master
    ) {
      formNotification.status = "neutral";
      formNotification.message = "No Change Detected.";

      return {
        ...prevState,
        notification: formNotification,
      };
    }

    // Check that the resource name dosen't already exist
    const isUniqueName = await checkResourceSlugUniquness(
      currentResource && "id" in currentResource ? currentResource.id : null,
      formInputValues.slug
    );

    if (!isUniqueName) {
      formNotification.message = "Resource Already Exists.";

      return {
        ...prevState,
        notification: formNotification,
      };
    }

    // Check that the resource email dosen't already exist
    const isUniqueEmail = await checkResourceEmailUniquness(
      currentResource && "id" in currentResource ? currentResource.id : null,
      formInputValues.email
    );

    if (!isUniqueEmail) {
      formNotification.message = "Email Already Exists.";

      return {
        ...prevState,
        notification: formNotification,
      };
    }

    try {
      if (!currentResource || !("id" in currentResource)) {
        // NEW RESOUIRCE INSERT

        await addResource(formInputValues);
        revalidatePath("/resources/");

        formNotification.status = "success";
        formNotification.message =
          "Resource Updated Successfully, Redirecting To New Endpoint.";

        return {
          ...prevState,
          resource: formInputValues,
          notification: formNotification,
          redirect: `/resources/${formInputValues.slug}/`,
        };
      } else {
        // Update Existing Resource

        const formInputValuesWithId: TResourceProps = {
          id: currentResource.id,
          ...formInputValues,
        };

        await updateResource(formInputValuesWithId);
        revalidatePath("/resources/");

        formNotification.status = "success";

        // Changed the title of the resource
        if (currentResource.slug !== formInputValuesWithId.slug) {
          await updateProjectResourcesResourceName(
            currentResource.id,
            formInputValuesWithId.slug,
            formInputValuesWithId.name
          );

          formNotification.message =
            "Resource Updated Successfully, Redirecting To New Endpoint.";

          return {
            ...prevState,
            resource: formInputValuesWithId,
            notification: formNotification,
            redirect: `/resources/${formInputValuesWithId.slug}/`,
          };
        }

        formNotification.message = "Resource Updated Successfully.";

        return {
          ...prevState,
          resource: formInputValuesWithId,
          notification: formNotification,
        };
      }
    } catch (error) {
      return {
        ...prevState,
        resource: currentResource,
        notification: formNotification,
      };
    }
  }

  return { ...prevState };
}

interface TDeleteProjectResource {
  notification: TNotificationState;
  redirect: string | null;
}

export async function deleteProjectResourceAction(
  id: number,
  context: "project" | "resource"
): Promise<TDeleteProjectResource> {
  if (context === "project") {
    try {
      await deleteProject(id);

      await deleteProjectResourcesByProjectId(id);
      revalidatePath("/projects/");

      return {
        notification: {
          status: "success",
          title: "Project Details Delete",
          message: "Project deleted successfully.",
        },
        redirect: "/projects/",
      };
    } catch (error) {
      return {
        notification: {
          status: "error",
          title: "Project Details Delete",
          message: "Error deleting project.",
        },
        redirect: null,
      };
    }
  }

  if (context === "resource") {
    try {
      await deleteResource(id);

      await deleteProjectResourcesByResourceId(id);

      revalidatePath("/resources/");

      return {
        notification: {
          status: "success",
          title: "Resource Details Delete",
          message: "Resource deleted successfully.",
        },
        redirect: "/resources/",
      };
    } catch (error) {
      return {
        notification: {
          status: "error",
          title: "Resource Details Delete",
          message: "Error deleting resource.",
        },
        redirect: null,
      };
    }
  }

  return {
    notification: {
      status: "error",
      title: "Details Delete",
      message: "Unknown Context.",
    },
    redirect: null,
  };
}
