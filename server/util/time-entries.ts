import "server-only";
import {
  TNewTimeEntriesProps,
  TProjectDetailsProps,
  TProjectResourcesProps,
  TResourceProps,
  TTimeEntriesProps,
} from "@/server/actions/data-fetches";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

export function createProjectResourceUnqiueId(
  projectResourceData: Omit<TProjectResourcesProps, "unique_identifier">
) {
  return (
    projectResourceData.project_id +
    "_" +
    projectResourceData.resource_id +
    "_" +
    projectResourceData.role_id +
    "_" +
    projectResourceData.rate_grade
  );
}

export function createTimeEntryUnqiueId(
  timeEntryData:
    | Omit<TTimeEntriesProps, "unique_identifier">
    | TTimeEntriesProps
    | TNewTimeEntriesProps
) {
  return (
    timeEntryData.project_id +
    "_" +
    timeEntryData.resource_id +
    "_" +
    timeEntryData.role_id +
    "_" +
    timeEntryData.rate_grade +
    "_" +
    timeEntryData.week_commencing
  );
}

export async function getProjectResourcesByProjectSlug(
  projectSlug: string
): Promise<TProjectResourcesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let responce: Omit<TProjectResourcesProps, "unique_identifier">[] = db
    .prepare(
      `SELECT DISTINCT
        project_id,
        project_slug,
        project_title,
        resource_id,
        resource_name,
        resource_slug,
        role_id,
        role,
        rate_grade
      FROM time_entries
      WHERE project_slug = ? 
      ORDER BY resource_name, role, rate_grade`
    )
    .all(projectSlug);

  const modfiedResponce: TProjectResourcesProps[] = responce.map((entry) => {
    return {
      ...entry,
      unique_identifier: createProjectResourceUnqiueId(entry),
    };
  });

  return modfiedResponce;
}

export async function getProjectResourcesByProjects(
  projectIds: number[]
): Promise<TProjectResourcesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let responce: Omit<TProjectResourcesProps, "unique_identifier">[] = db
    .prepare(
      `SELECT DISTINCT
        project_id,
        project_slug,
        project_title,
        resource_id,
        resource_name,
        resource_slug,
        role_id,
        role,
        rate_grade
      FROM time_entries
      WHERE project_id IN (${projectIds.map(() => "?").join(",")})
      ORDER BY resource_name, role, rate_grade`
    )
    .all(projectIds);

  const modfiedResponce: TProjectResourcesProps[] = responce.map((entry) => {
    return {
      ...entry,
      unique_identifier: createProjectResourceUnqiueId(entry),
    };
  });

  return modfiedResponce;
}

export async function getProjectResourcesByResources(
  resourceIds: number[]
): Promise<TProjectResourcesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // GET ABSENCE DATA

  let responce: Omit<TProjectResourcesProps, "unique_identifier">[] = db
    .prepare(
      `SELECT DISTINCT
        project_id,
        project_slug,
        project_title,
        resource_id,
        resource_name,
        resource_slug,
        role_id,
        role,
        rate_grade
      FROM time_entries
      WHERE resource_id IN (${resourceIds.map(() => "?").join(",")})
      ORDER BY resource_name, role, rate_grade`
    )
    .all(resourceIds);

  const modfiedResponce: TProjectResourcesProps[] = responce.map((entry) => {
    return {
      ...entry,
      unique_identifier: createProjectResourceUnqiueId(entry),
    };
  });

  return modfiedResponce;
}

export async function getProjectResourcesByResourceSlug(
  resourceSlug: string
): Promise<TProjectResourcesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // GET ABSENCE DATA

  const responce: Omit<TProjectResourcesProps, "unique_identifier">[] = db
    .prepare(
      `SELECT DISTINCT
        project_id,
        project_slug,
        project_title,
        resource_id,
        resource_name,
        resource_slug,
        role_id,
        role,
        rate_grade
      FROM time_entries
      WHERE resource_slug = ? 
      ORDER BY resource_name, role, rate_grade`
    )
    .all(resourceSlug);

  const modfiedResponce: TProjectResourcesProps[] = responce.map((entry) => {
    return {
      ...entry,
      unique_identifier: createProjectResourceUnqiueId(entry),
    };
  });

  return modfiedResponce;
}

export async function getResourcesTimeEntries(
  resourceIds: number[],
  weeks: string[]
): Promise<TTimeEntriesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const responce: Omit<TTimeEntriesProps, "unique_identifier">[] = db
    .prepare(
      `
      SELECT * FROM time_entries 
      WHERE resource_id IN (${resourceIds.map(() => "?").join(",")})
      AND week_commencing IN (${weeks.map(() => "?").join(",")})`
    )
    .all(resourceIds, weeks);

  const modfiedResponce: TTimeEntriesProps[] = responce.map((entry) => {
    return {
      ...entry,
      unique_identifier: createTimeEntryUnqiueId(entry),
    };
  });

  return modfiedResponce;
}

export async function getProjectTimeEntries(
  projectId: number,
  weeks: string[]
): Promise<TTimeEntriesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const responce: Omit<TTimeEntriesProps, "unique_identifier">[] = db
    .prepare(
      `
      SELECT * FROM time_entries
      WHERE project_id = ?
      AND week_commencing IN (${weeks.map(() => "?").join(",")})`
    )
    .all(projectId, weeks);

  const modfiedResponce: TTimeEntriesProps[] = responce.map((entry) => {
    return {
      ...entry,
      unique_identifier: createTimeEntryUnqiueId(entry),
    };
  });

  return modfiedResponce;
}

export async function updateTimeEntriesProjectTitle(
  project: TProjectDetailsProps
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
    UPDATE time_entries
    SET
      project_slug = ?,
      project_title = ?
    WHERE project_id = ?`
    )
    .run(project.slug, project.title, project.id);
}

export async function updateTimeEntriesResourceName(resource: TResourceProps) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
    UPDATE time_entries
    SET
      resource_slug = ?,
      resource_name = ?
    WHERE resource_id = ?`
    )
    .run(resource.slug, resource.name, resource.id);
}

export async function updateTimeEntries(timeEntries: TTimeEntriesProps[]) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const timeEntryUpdate = db.prepare(
    `
      UPDATE time_entries
      SET
        project_id = @project_id,
        project_slug = @project_slug,
        project_title = @project_title,
        resource_id = @resource_id,
        resource_name = @resource_name,
        resource_slug = @resource_slug,
        role_id = @role_id,
        role = @role,
        rate_grade = @rate_grade,
        week_commencing = @week_commencing,
        work_days = @work_days
      WHERE id = @id`
  );

  for (const time_entry of timeEntries) {
    await timeEntryUpdate.run(time_entry);
  }
}

export async function addTimeEntries(timeEntries: TNewTimeEntriesProps[]) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const timeEntryInsert = db.prepare(`
      INSERT INTO time_entries VALUES (
        null,
        @project_id,
        @project_slug,
        @project_title,
        @resource_id,
        @resource_name,
        @resource_slug,
        @role_id,
        @role,
        @rate_grade,
        @week_commencing,
        @work_days
      )
    `);

  for (const time_entry of timeEntries) {
    await timeEntryInsert.run(time_entry);
  }
}

export async function deleteTimeEnties(timeEntryIds: number[]) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const timeEntryDelete = db.prepare("DELETE FROM time_entries WHERE id = ?");

  for (const id of timeEntryIds) {
    await timeEntryDelete.run(id);
  }
}

export async function deleteTimeEntiesByProjectId(projectId: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare("DELETE FROM time_entries WHERE project_id = ?").run(projectId);
}

export async function deleteTimeEntiesByResourceId(resourceId: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare("DELETE FROM time_entries WHERE resource_id = ?").run(resourceId);
}

export async function deleteZeroedTimeEntries() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare("DELETE FROM time_entries WHERE work_days = 0").run();
}
