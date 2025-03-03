import "server-only";
import { TWeekProps } from "@/server/actions/data-fetches";

// import sql from "better-sqlite3";
const sql = require("better-sqlite3");

const db = sql("trackers.db");

export async function getWeeks(): Promise<TWeekProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .prepare(
      `
    SELECT
      week_commencing,
      week_index,
      month_index,
      month_year_string,
      year,
      SUM(work_day) AS total_working_days
    FROM dates
    GROUP BY 1, 2, 3, 4
    ORDER BY week_commencing
  `
    )
    .all();
}

export async function getAbsenceDaysByWeek(
  start_of_absence: string,
  end_of_absence: string
): Promise<TWeekProps[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .prepare(
      `
    SELECT
      week_commencing,
      week_index,
      month_index,
      month_year_string,
      year,
      SUM(work_day) AS total_working_days
    FROM dates
    WHERE date >= ? AND date <= ?
    GROUP BY 1, 2, 3, 4, 5
    ORDER BY week_commencing
  `
    )
    .all(start_of_absence, end_of_absence);
}
