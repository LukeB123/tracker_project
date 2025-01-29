"use server";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

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

export async function getAbsenceRequests(): Promise<TAbsenceRequestProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db.prepare("SELECT * FROM absence ORDER BY start_of_absence").all();
}

export async function addAbsenceRequest(
  absenceRequests: TNewAbsenceRequestProps[]
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const absenceRequestsInsert = db.prepare(`
      INSERT INTO absence VALUES (
        null,
        @resource_id,
        @resource_name,
        @approver_id,
        @approver_name,
        @absence_type,
        @absence_duration,
        @start_of_absence,
        @end_of_absence,
        @status
      )
    `);

  for (const absenceRequest of absenceRequests) {
    await absenceRequestsInsert.run(absenceRequest);
  }
}

export async function declineAbsenceRequest(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
  UPDATE absence
  SET
    status = 'Declined'
  WHERE id = ?`
    )
    .run(id);
}

export async function approveAbsenceRequest(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
  UPDATE absence
  SET
    status = 'Approved'
  WHERE id = ?`
    )
    .run(id);

  // TODO
  // ADD TIME TO project_time_entries
}

export async function cancelAbsenceRequest(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
  UPDATE absence
  SET
    status = 'Cancelled'
  WHERE id = ?`
    )
    .run(id);

  // TODO
  // REMOVE TIME IN project_time_entries
}
