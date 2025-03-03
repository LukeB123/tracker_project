import "server-only";
import {
  TAbsenceRequestProps,
  TNewAbsenceRequestProps,
  TAbsenceTimeEntriesProps,
  TNewAbsenceTimeEntriesProps,
  TResourceProps,
} from "@/server/actions/data-fetches";

import { getAbsenceDaysByWeek } from "@/server/util/date";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

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

export async function declineAbsenceRequest(requestId: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
  UPDATE absence
  SET
    status = 'Declined'
  WHERE id = ?`
    )
    .run(requestId);

  await deleteAbsenceRequestTimeEntries(requestId);
}

export async function approveAbsenceRequest(request: TAbsenceRequestProps) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
  UPDATE absence
  SET
    status = 'Approved'
  WHERE id = ?`
    )
    .run(request.id);

  await addAbsenceTimeEntries(request);
}

export async function cancelAbsenceRequest(requestId: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
  UPDATE absence
  SET
    status = 'Cancelled'
  WHERE id = ?`
    )
    .run(requestId);

  await deleteAbsenceRequestTimeEntries(requestId);
}

export async function deleteResourceAbsenceRequests(resourceId: number) {
  await db.prepare("DELETE FROM absence WHERE resource_id = ?").run(resourceId);

  await db
    .prepare("DELETE FROM absence_time_entries WHERE resource_id = ?")
    .run(resourceId);
}

export async function deleteAbsenceRequestTimeEntries(requestId: number) {
  await db
    .prepare("DELETE FROM absence_time_entries WHERE request_id = ?")
    .run(requestId);
}

export async function getAbsenceTimeEntries(
  resourceIds: number[],
  weeks: string[]
): Promise<TAbsenceTimeEntriesProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .prepare(
      `
      SELECT * FROM absence_time_entries 
      WHERE resource_id IN (${resourceIds.map(() => "?").join(",")})
      AND week_commencing IN (${weeks.map(() => "?").join(",")})`
    )
    .all(resourceIds, weeks);
}

export async function addAbsenceTimeEntries(request: TAbsenceRequestProps) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const absenceTimeEntries = await getAbsenceDaysByWeek(
    request.start_of_absence,
    request.end_of_absence
  );

  const newAbsenceTimeEntries: TNewAbsenceTimeEntriesProps[] = [];

  absenceTimeEntries.forEach((week) =>
    newAbsenceTimeEntries.push({
      request_id: request.id,
      resource_id: request.resource_id,
      resource_name: request.resource_name,
      resource_slug: request.resource_name.toLowerCase().replaceAll(" ", "-"),
      week_commencing: week.week_commencing,
      work_days:
        request.absence_duration === "Half Day"
          ? week.total_working_days * 0.5
          : week.total_working_days,
    })
  );

  const absenceTimeEntryInsert = db.prepare(`
      INSERT INTO absence_time_entries VALUES (
        null,
        @request_id,
        @resource_id,
        @resource_name,
        @resource_slug,
        @week_commencing,
        @work_days
      )
    `);

  for (const time_entry of newAbsenceTimeEntries) {
    await absenceTimeEntryInsert.run(time_entry);
  }
}

export async function updateAbsenceResourceName(resource: TResourceProps) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db
    .prepare(
      `
    UPDATE absence
    SET
      resource_name = ?
    WHERE resource_id = ?`
    )
    .run(resource.name, resource.id);

  await db
    .prepare(
      `
      UPDATE absence
      SET
        approver_name = ?
      WHERE approver_id = ?`
    )
    .run(resource.name, resource.id);

  await db
    .prepare(
      `
      UPDATE absence_time_entries
      SET
        resource_name = ?,
        resource_slug = ?
      WHERE resource_id = ?`
    )
    .run(resource.name, resource.slug, resource.id);
}
