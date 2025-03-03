import "server-only";

import {
  TResourceProps,
  TNewResourceProps,
} from "@/server/actions/data-fetches";
import {
  deleteResourceAbsenceRequests,
  updateAbsenceResourceName,
} from "./absence";
import { updateProjectResourceNames } from "./projects";
import {
  deleteTimeEntiesByResourceId,
  updateTimeEntriesResourceName,
} from "./time-entries";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

export async function getResources(): Promise<TResourceProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM resources ORDER BY name").all();
}

export async function getResource(resourceId: number): Promise<TResourceProps> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM resources WHERE id = ?").get(resourceId);
}

export async function getResourceFromSlug(
  resourceSlug: string
): Promise<TResourceProps> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM resources WHERE slug = ?").get(resourceSlug);
}

export async function addResource(resource: TNewResourceProps) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare(
    `
  INSERT INTO resources (
    name,
    slug,
    email,
    grade,
    role_id,
    role,
    team,
    is_delivery_manager,
    is_project_manager,
    is_scrum_master
  )
  VALUES (
    @name,
    @slug,
    @email,
    @grade,
    @role_id,
    @role,
    @team,
    @is_delivery_manager,
    @is_project_manager,
    @is_scrum_master)`
  ).run(resource);
}

export async function deleteResource(resourceId: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare("DELETE FROM resources WHERE id = ?").run(resourceId);

  await deleteTimeEntiesByResourceId(resourceId);
  await deleteResourceAbsenceRequests(resourceId);
}

export async function updateResource(
  resource: TResourceProps,
  nameChange: boolean = false
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
  UPDATE resources
  SET
    name = @name,
    slug = @slug,
    email = @email,
    grade = @grade,
    role_id = @role_id,
    role = @role,
    team = @team,
    is_delivery_manager = @is_delivery_manager,
    is_project_manager = @is_project_manager,
    is_scrum_master = @is_scrum_master
  WHERE id = @id`
    )
    .run(resource);

  if (nameChange) {
    updateAbsenceResourceName(resource);
    updateProjectResourceNames(resource);
    updateTimeEntriesResourceName(resource);
  }
}

export async function checkResourceSlugUniquness(
  resourceId: number | null,
  resourceSlug: string
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let result: any;

  if (resourceId === null) {
    result = db
      .prepare("SELECT slug FROM resources WHERE slug = ?")
      .all(resourceSlug);
  } else {
    result = db
      .prepare("SELECT slug FROM resources WHERE slug = ? AND id <> ?")
      .all(resourceSlug, resourceId);
  }

  return result.length < 1;
}

export async function checkResourceEmailUniquness(
  resourceId: number | null,
  resourceSlug: string
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let result: any;

  if (resourceId === null) {
    result = db
      .prepare("SELECT email FROM resources WHERE email = ?")
      .all(resourceSlug);
  } else {
    result = db
      .prepare("SELECT email FROM resources WHERE email = ? AND id <> ?")
      .all(resourceSlug, resourceId);
  }

  return result.length < 1;
}
