"use server";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

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

export async function getProjectResourcesByProjectId(
  projectId: number
): Promise<TProjectResourcesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .prepare(
      "SELECT * FROM project_resources WHERE project_id = ? ORDER BY resource_name, role, rate_grade"
    )
    .all(projectId);
}

export async function getProjectResourcesByProjectSlug(
  projectSlug: string
): Promise<TProjectResourcesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .prepare(
      "SELECT * FROM project_resources WHERE project_slug = ? ORDER BY resource_name, role, rate_grade"
    )
    .all(projectSlug);
}

export async function getProjectResourcesByResource(
  resourceId: number
): Promise<TProjectResourcesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .prepare(
      "SELECT * FROM project_resources WHERE resource_id = ? ORDER BY resource_name, role, rate_grade"
    )
    .all(resourceId);
}

export async function getProjectResourcesByResourceSlug(
  resourceSlug: string
): Promise<TProjectResourcesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .prepare(
      "SELECT * FROM project_resources WHERE resource_slug = ? ORDER BY resource_name, role, rate_grade"
    )
    .all(resourceSlug);
}

export async function getProjectResourceByUniqueIds(
  uniqueIds: string[]
): Promise<TProjectResourcesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .prepare(
      `SELECT * FROM project_resources WHERE unique_identifier IN (${uniqueIds
        .map(() => "?")
        .join(",")})
        ORDER BY resource_name, role, rate_grade`
    )
    .all(uniqueIds);
}

// Add date range
export async function getResourcesTimeEntries(
  resourceIds: number[],
  weeks: string[]
): Promise<TTimeEntriesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .prepare(
      `
        SELECT * FROM project_time_entries 
        WHERE resource_id IN (${resourceIds.map(() => "?").join(",")})
        AND week_commencing IN (${weeks.map(() => "?").join(",")})`
    )
    .all(resourceIds, weeks);
}

export async function getProjectTimeEntries(
  projectId: number,
  weeks: string[]
): Promise<TTimeEntriesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .prepare(
      `
        SELECT * FROM project_time_entries 
        WHERE project_id = ?
        AND week_commencing IN (${weeks.map(() => "?").join(",")})`
    )
    .all(projectId, weeks);
}

export async function updateProjectResourcesProjectTitle(
  projectId: number,
  projectSlug: string,
  projectTitle: string
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
    UPDATE project_resources
    SET
      project_slug = ?,
      project_title = ?
    WHERE project_id = ?`
    )
    .run(projectSlug, projectTitle, projectId);

  await db
    .prepare(
      `
    UPDATE project_time_entries
    SET
      project_slug = ?,
      project_title = ?
    WHERE project_id = ?`
    )
    .run(projectSlug, projectTitle, projectId);
}

export async function updateProjectResources(
  projectResources: TProjectResourcesProps[]
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const projectResourcesUpdate = db.prepare(
    `
        UPDATE project_resources
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
          unique_identifier = @unique_identifier
        WHERE id = @id`
  );

  for (const projectResource of projectResources) {
    await projectResourcesUpdate.run(projectResource);
  }
}

export async function updateTimeEntries(timeEntries: TTimeEntriesProps[]) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const timeEntryUpdate = db.prepare(
    `
      UPDATE project_time_entries
      SET
        project_id = @project_id,
        project_slug = @project_slug,
        project_title = @project_title,
        resource_id = @resource_id,
        role_id = @role_id,
        rate_grade = @rate_grade,
        week_commencing = @week_commencing,
        work_days = @work_days,
        unique_identifier = @unique_identifier
      WHERE id = @id`
  );

  for (const time_entry of timeEntries) {
    await timeEntryUpdate.run(time_entry);
  }
}

export async function addProjectResources(
  projectResources: TNewProjectResourcesProps[]
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const projectResourcesInsert = db.prepare(`
      INSERT INTO project_resources VALUES (
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
        @unique_identifier
      )
    `);

  for (const projectResource of projectResources) {
    await projectResourcesInsert.run(projectResource);
  }
}

export async function addTimeEntries(timeEntries: TNewTimeEntriesProps[]) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const timeEntryInsert = db.prepare(`
      INSERT INTO project_time_entries VALUES (
        null,
        @project_id,
        @project_slug,
        @project_title,
        @resource_id,
        @role_id,
        @rate_grade,
        @week_commencing,
        @work_days,
        @unique_identifier
      )
    `);

  for (const time_entry of timeEntries) {
    await timeEntryInsert.run(time_entry);
  }
}

export async function deleteProjectResources(projectResourceIds: number[]) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const projectResourcesDelete = db.prepare(
    "DELETE FROM project_resources WHERE id = ?"
  );

  for (const id of projectResourceIds) {
    await projectResourcesDelete.run(id);
  }
}
export async function deleteTimeEnties(timeEntryIds: number[]) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const timeEntryDelete = db.prepare(
    "DELETE FROM project_time_entries WHERE id = ?"
  );

  for (const id of timeEntryIds) {
    await timeEntryDelete.run(id);
  }
}

export async function deleteProjectResourcesByProjectId(projectId: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare("DELETE FROM project_resources WHERE project_id = ?").run(
    projectId
  );

  db.prepare("DELETE FROM project_time_entries WHERE project_id = ?").run(
    projectId
  );
}

export async function deleteZeroedTimeEntries() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare("DELETE FROM project_time_entries WHERE work_days = 0").run();
}
