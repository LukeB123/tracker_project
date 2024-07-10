"use server";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

export type TPeopleProps = {
  id: number;
  name: string;
  grade: string;
  role: string;
};

export async function getResources(): Promise<TPeopleProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM people ORDER BY name").all();
}
