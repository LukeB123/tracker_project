import "server-only";

import {
  TResourceProps,
  TNewResourceProps,
  TRole,
} from "@/server/actions/data-fetches";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

export async function getResources(): Promise<TResourceProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM resources ORDER BY name").all();
}

export async function getResource(id: number): Promise<TResourceProps> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM resources WHERE id = ?").get(id);
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

export async function updateResource(resource: TResourceProps) {
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
}

export async function getResourceFromSlug(
  slug: string
): Promise<TResourceProps> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM resources WHERE slug = ?").get(slug);
}

export async function getRoles(): Promise<TRole[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM roles ORDER BY role").all();
}

export async function deleteResource(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare("DELETE FROM resources WHERE id = ?").run(id);
}

export async function checkResourceSlugUniquness(
  id: number | null,
  slug: string
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let result: any;

  if (id === null) {
    result = db.prepare("SELECT slug FROM resources WHERE slug = ?").all(slug);
  } else {
    result = db
      .prepare("SELECT slug FROM resources WHERE slug = ? AND id <> ?")
      .all(slug, id);
  }

  return result.length < 1;
}

export async function checkResourceEmailUniquness(
  id: number | null,
  slug: string
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let result: any;

  if (id === null) {
    result = db
      .prepare("SELECT email FROM resources WHERE email = ?")
      .all(slug);
  } else {
    result = db
      .prepare("SELECT email FROM resources WHERE email = ? AND id <> ?")
      .all(slug, id);
  }

  return result.length < 1;
}
