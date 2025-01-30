"use server";

import { getAbsenceRequests } from "@/server/util/absence";
import { getWeeks } from "@/server/util/date";
import { getProject, getProjects } from "@/server/util/projects";
import {
  getResources,
  getRoles,
  getResourceFromSlug,
} from "@/server/util/resources";
import {
  getProjectResourcesByProjectSlug,
  getResourcesTimeEntries,
} from "@/server/util/time-entries";

export type TWeekProps = {
  week_commencing: string;
  weekIndex: 1 | 2 | 3 | 4 | 5;
  monthYearString: string;
  monthIndex: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  year: number;
  total_working_days: 0 | 1 | 2 | 3 | 4 | 5;
};

export type TResourceProps = {
  id: number;
  name: string;
  slug: string;
  email: string;
  grade: string;
  role_id: number;
  role: string;
  team: string;
  is_delivery_manager: 0 | 1;
  is_project_manager: 0 | 1;
  is_scrum_master: 0 | 1;
};

export type TNewResourceProps = {
  name: string;
  slug: string;
  email: string;
  grade: string;
  role_id: number;
  role: string;
  team: string;
  is_delivery_manager: 0 | 1;
  is_project_manager: 0 | 1;
  is_scrum_master: 0 | 1;
};

export type TRole = {
  id: number;
  role: string;
};

export type TAbsenceRequestProps = {
  id: number;
  resource_id: number;
  resource_name: string;
  approver_id: number;
  approver_name: string;
  absence_type: string;
  absence_duration: string;
  start_of_absence: string;
  end_of_absence: string;
  status: "Pending" | "Approved" | "Declined" | "Cancelled";
};

export type TNewAbsenceRequestProps = {
  resource_id: number;
  resource_name: string;
  approver_id: number;
  approver_name: string;
  absence_type: string;
  absence_duration: string;
  start_of_absence: string;
  end_of_absence: string;
  status: "Pending" | "Approved" | "Declined" | "Cancelled";
};

export type TProjectDetailsProps = {
  id: number;
  slug: string;
  title: string;
  delivery_manager: string;
  delivery_manager_id: number;
  project_manager: string;
  project_manager_id: number;
  delivery_stream: string;
  value_stream: string;
  scrum_master: string;
  scrum_master_id: number;
  project_type: string;
  last_updated: string;
  line_of_business: string;
  task: string;
};

export type TNewProjectDetailsProps = {
  slug: string;
  title: string;
  delivery_manager: string;
  delivery_manager_id: number;
  project_manager: string;
  project_manager_id: number;
  delivery_stream: string;
  value_stream: string;
  scrum_master: string;
  scrum_master_id: number;
  project_type: string;
  last_updated: string;
  line_of_business: string;
  task: string;
};

export type TProjectResourcesProps = {
  id: number;
  project_id: number;
  project_slug: string;
  project_title: string;
  resource_id: number;
  resource_name: string;
  resource_slug: string;
  role_id: number;
  role: string;
  rate_grade: string;
  unique_identifier: string;
};

export type TNewProjectResourcesProps = {
  project_id: number | undefined;
  project_slug: string;
  project_title: string;
  resource_id: number | undefined;
  resource_name: string;
  resource_slug: string;
  role_id: number | undefined;
  role: string;
  rate_grade: string;
  unique_identifier: string;
};

export type TTimeEntriesProps = {
  id: number;
  project_id: number;
  project_slug: string;
  project_title: string;
  resource_id: number;
  role_id: number;
  rate_grade: string;
  week_commencing: string;
  work_days: number;
  unique_identifier: string;
};

export type TNewTimeEntriesProps = {
  project_id: number;
  project_slug: string;
  project_title: string;
  resource_id: number;
  role_id: number;
  rate_grade: string;
  week_commencing: string;
  work_days: number;
  unique_identifier: string;
};

export async function getAbsenceRequestsFromServer() {
  return await getAbsenceRequests();
}

export async function getProjectsFromServer() {
  return await getProjects();
}

export async function getProjectFromServer(slug: string) {
  return await getProject(slug);
}

export async function getResourcesFromServer() {
  return await getResources();
}

export async function getResourceFromSlugFromServer(slug: string) {
  return await getResourceFromSlug(slug);
}

export async function getRolesFromServer() {
  return await getRoles();
}

export async function getWeeksFromServer() {
  return await getWeeks();
}

export async function getProjectResourcesByProjectSlugFromServer(
  projectSlug: string
) {
  return await getProjectResourcesByProjectSlug(projectSlug);
}

export async function getResourcesTimeEntriesFromServer(
  resourceIds: number[],
  weeks: string[]
) {
  return await getResourcesTimeEntries(resourceIds, weeks);
}
