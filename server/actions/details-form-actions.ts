"use server";

import { revalidatePath } from "next/cache";

import { TNotificationState } from "@/app/lib/features/ui/uiSlice";

import {
  addProject,
  updateProject,
  deleteProject,
  checkProjectSlugUniquness,
  getProjectFromSlug,
} from "@/server/util/projects";

import {
  addResource,
  updateResource,
  deleteResource,
  checkResourceSlugUniquness,
  checkResourceEmailUniquness,
  getResourceFromSlug,
} from "@/server/util/resources";

import {
  TNewProjectDetailsProps,
  TNewResourceProps,
  TProjectDetailsProps,
  TResourceProps,
} from "@/server/actions/data-fetches";

interface TFormState {
  context: "project" | "resource";
  project: TProjectDetailsProps | null;
  resource: TResourceProps | null;
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
      project_manager: formData.get("project_manager") as string,
      project_manager_id: +(formData.get("project_manager_id") as string),
      delivery_manager: formData.get("delivery_manager") as string,
      delivery_manager_id: +(formData.get("delivery_manager_id") as string),
      scrum_master: formData.get("scrum_master") as string,
      scrum_master_id: +(formData.get("scrum_master_id") as string),
      task: (formData.get("task") as string).trim(),
      delivery_stream: formData.get("delivery_stream") as string,
      value_stream: (formData.get("value_stream") as string).trim(),
      project_type: formData.get("project_type") as string,
      last_updated: "",
      line_of_business: formData.get("line_of_business") as string,
    };

    // Check if there are any empty inputs
    if (
      isInvalidText(formInputValues.title) ||
      formInputValues.project_manager_id === 0 ||
      formInputValues.delivery_manager_id === 0 ||
      formInputValues.scrum_master_id === 0 ||
      isInvalidText(formInputValues.task) ||
      isInvalidText(formInputValues.delivery_stream) ||
      isInvalidText(formInputValues.value_stream) ||
      isInvalidText(formInputValues.project_type) ||
      isInvalidText(formInputValues.line_of_business)
    ) {
      formNotification.status = "neutral";
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
      formInputValues.project_manager_id ===
        currentProject.project_manager_id &&
      formInputValues.delivery_manager_id ===
        currentProject.delivery_manager_id &&
      formInputValues.scrum_master_id === currentProject.scrum_master_id &&
      formInputValues.task === currentProject.task &&
      formInputValues.delivery_stream === currentProject.delivery_stream &&
      formInputValues.value_stream === currentProject.value_stream &&
      formInputValues.project_type === currentProject.project_type &&
      formInputValues.line_of_business === currentProject.line_of_business
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
      currentProject ? currentProject.id : null,
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
      if (!currentProject) {
        // NEW PROJECT INSERT

        await addProject(formInputValues);
        const newProject = await getProjectFromSlug(formInputValues.slug);
        revalidatePath("/projects/");

        formNotification.status = "success";
        formNotification.message =
          "Project Updated Successfully, Redirecting To New Endpoint.";

        return {
          ...prevState,
          project: newProject,
          notification: formNotification,
          redirect: `/projects/${newProject.slug}/`,
        };
      } else {
        // Update Existing Project

        const updatedProject: TProjectDetailsProps = {
          id: currentProject.id,
          ...formInputValues,
        };

        await updateProject(
          updatedProject,
          currentProject.slug !== updatedProject.slug
        );
        revalidatePath("/projects/");

        formNotification.status = "success";
        formNotification.message = "Project Updated Successfully.";

        // Changed the title of the project
        if (currentProject.slug !== updatedProject.slug) {
          return {
            ...prevState,
            project: updatedProject,
            notification: formNotification,
            redirect: `/projects/${updatedProject.slug}/`,
          };
        }

        return {
          ...prevState,
          project: updatedProject,
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
      formNotification.status = "neutral";
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
      currentResource ? currentResource.id : null,
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
      currentResource ? currentResource.id : null,
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
      if (!currentResource) {
        // NEW RESOUIRCE INSERT

        await addResource(formInputValues);
        const newResource = await getResourceFromSlug(formInputValues.slug);
        revalidatePath("/resources/");

        formNotification.status = "success";
        formNotification.message =
          "Resource Updated Successfully, Redirecting To New Endpoint.";

        return {
          ...prevState,
          resource: newResource,
          notification: formNotification,
          redirect: `/resources/${newResource.slug}/`,
        };
      } else {
        // Update Existing Resource

        const updatedResource: TResourceProps = {
          id: currentResource.id,
          ...formInputValues,
        };

        await updateResource(
          updatedResource,
          currentResource.slug !== updatedResource.slug
        );
        revalidatePath("/resources/");

        formNotification.status = "success";
        formNotification.message = "Resource Updated Successfully.";

        // Changed the title of the resource
        if (currentResource.slug !== updatedResource.slug) {
          return {
            ...prevState,
            resource: updatedResource,
            notification: formNotification,
            redirect: `/resources/${updatedResource.slug}/`,
          };
        }

        return {
          ...prevState,
          resource: updatedResource,
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

  return {
    ...prevState,
    notification: {
      status: "error",
      title: "Details Delete",
      message: "Unknown Context.",
    },
  };
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
