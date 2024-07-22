"use server";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

export type TResourceProps = {
  id: number;
  name: string;
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

export async function getResources(): Promise<TResourceProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM resources ORDER BY name").all();
}

export async function getRoles(): Promise<TRole[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM roles ORDER BY role").all();
}
