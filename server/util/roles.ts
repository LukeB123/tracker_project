import "server-only";

import { TRole } from "@/server/actions/data-fetches";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

export async function getRoles(): Promise<TRole[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM roles ORDER BY role").all();
}
