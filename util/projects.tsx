"use server";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

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
  delivery_manager_id: number | undefined;
  project_manager: string;
  project_manager_id: number | undefined;
  delivery_stream: string;
  value_stream: string;
  scrum_master: string;
  scrum_master_id: number | undefined;
  project_type: string;
  last_updated: undefined;
  line_of_business: string;
  task: string;
};

export async function getProjects(): Promise<TProjectDetailsProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM projects ORDER BY last_updated DESC").all();
}

export async function getProject(slug: string): Promise<TProjectDetailsProps> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM projects WHERE slug = ?").get(slug);
}

export async function getProjectId(slug: string): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT id FROM projects WHERE slug = ?").get(slug);
}

export async function getProjectSlug(id: number | null): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const result = db.prepare("SELECT slug FROM projects WHERE id = ?").get(id);

  if (result) {
    return result.slug;
  }

  return result;
}

export async function deleteProject(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare("DELETE FROM projects WHERE id = ?").run(id);
}

export async function addProject(project: TNewProjectDetailsProps) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare(
    `
  INSERT INTO projects (
    slug,
    title,
    delivery_manager,
    delivery_manager_id,
    project_manager,
    project_manager_id,
    scrum_master,
    scrum_master_id,
    delivery_stream,
    value_stream,
    project_type,
    last_updated,
    line_of_business,
    task
  )
  VALUES (
    @slug,
    @title,
    @delivery_manager,
    @delivery_manager_id,
    @project_manager,
    @project_manager_id,
    @scrum_master,
    @scrum_master_id,
    @delivery_stream,
    @value_stream,
    @project_type,
    datetime('now', 'localtime'),
    @line_of_business,
    @task)`
  ).run(project);
}

export async function updateProject(project: TProjectDetailsProps) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
  UPDATE projects
  SET
    slug = @slug,
    title = @title,
    delivery_manager = @delivery_manager,
    delivery_manager_id = @delivery_manager_id,
    project_manager = @project_manager,
    project_manager_id = @project_manager_id,
    scrum_master = @scrum_master,
    scrum_master_id = @scrum_master_id,
    delivery_stream = @delivery_stream,
    value_stream = @value_stream,
    project_type = @project_type,
    last_updated = datetime('now', 'localtime'),
    line_of_business = @line_of_business,
    task = @task
  WHERE id = @id`
    )
    .run(project);
}

export async function updateProjectsLastUpdated(projectIds: number[]) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const projectsUpdate = db.prepare(
    `
        UPDATE projects
        SET
          last_updated = datetime('now', 'localtime')
        WHERE id = ?`
  );

  for (const projectId of projectIds) {
    await projectsUpdate.run(projectId);
  }
}

export async function checkSlugUniquness(id: number | null, slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const result = db
    .prepare("SELECT slug FROM projects WHERE slug = ? AND id <> ?")
    .all(slug, id);

  return result.length < 1;
}
