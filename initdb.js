const sql = require("better-sqlite3");
const db = sql("trackers.db");

// const weeks = [
//     {week: new Date(2024, 4, 11, 4, 23, 0), month :}

// ]

const people = [
  {
    name: "Nick Fury",
    grade: "7",
    role: "Marvel",
  },
  {
    name: "Tony Stark",
    grade: "7",
    role: "Marvel",
  },
  {
    name: "Steve Rodgers",
    grade: "5",
    role: "Marvel",
  },
  {
    name: "Black Widow",
    grade: "4",
    role: "Marvel",
  },
  {
    name: "Peter Parker",
    grade: "3",
    role: "Marvel",
  },
  {
    name: "Captin Marvel",
    grade: "6",
    role: "Marvel",
  },
  {
    name: "Thor",
    grade: "6",
    role: "Marvel",
  },
  {
    name: "Loci",
    grade: "6",
    role: "Marvel",
  },
];

const dummyProjects = [
  {
    slug: "project-1",
    title: "Project 1",
    delivery_manager: "Tony Stark",
    delivery_manager_id: 2,
    project_manager: "Steve Rodgers",
    project_manager_id: 3,
    scrum_master: "Peter Parker",
    scrum_master_id: 5,
    delivery_stream: "Delivery Stream 1",
    value_stream: "Broadway",
    project_type: "Timed",
    last_updated: "2024-04-11 14:23",
    line_of_business: "Project",
    task: "task1",
  },
  {
    slug: "project-2",
    title: "Project 2",
    delivery_manager: "Tony Stark",
    delivery_manager_id: 2,
    project_manager: "Steve Rodgers",
    project_manager_id: 3,
    scrum_master: "Black Widow",
    scrum_master_id: 4,
    delivery_stream: "Delivery Stream 2",
    value_stream: "Broadway",
    project_type: "Timed",
    last_updated: "2024-04-14 19:23",
    line_of_business: "Service",
    task: "task2",
  },
  {
    slug: "project-3",
    title: "Project 3",
    delivery_manager: "Nick Fury",
    delivery_manager_id: 1,
    project_manager: "Captin Marvel",
    project_manager_id: 6,
    scrum_master: "Peter Parker",
    scrum_master_id: 5,
    delivery_stream: "Delivery Stream 3",
    value_stream: "Broadway",
    project_type: "Fixed",
    last_updated: "2024-05-14 14:23",
    line_of_business: "Opportunity",
    task: "task3",
  },
  {
    slug: "project-4",
    title: "Project 4",
    delivery_manager: "Nick Fury",
    delivery_manager_id: 1,
    project_manager: "Thor",
    project_manager_id: 7,
    scrum_master: "Loci",
    scrum_master_id: 8,
    delivery_stream: "Delivery Stream 4",
    value_stream: "Far Far Away",
    project_type: "Fixed",
    last_updated: "2024-04-14 14:23",
    line_of_business: "Project",
    task: "task4",
  },
];

const dummyProjectResources = [
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 1,
    resource_name: "Nick Fury",
    rate_grade: "4",
    unique_identifier: "1_1_4",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 2,
    resource_name: "Tony Stark",
    rate_grade: "4",
    unique_identifier: "1_2_4",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 3,
    resource_name: "Steve Rodgers",
    rate_grade: "5",
    unique_identifier: "1_3_5",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 4,
    resource_name: "Black Widow",
    rate_grade: "4",
    unique_identifier: "2_4_4",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 5,
    resource_name: "Peter Parker",
    rate_grade: "6",
    unique_identifier: "2_5_6",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 1,
    resource_name: "Nick Fury",
    rate_grade: "6",
    unique_identifier: "2_1_6",
  },
];

const dummyHours = [
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 1,
    week_commencing: "2024-05-18",
    work_days: 2.5,
    unique_identifier: "1_1_2024-05-18",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 2,
    week_commencing: "2024-05-18",
    work_days: 3,
    unique_identifier: "1_2_2024-05-18",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 3,
    week_commencing: "2024-05-18",
    work_days: 4,
    unique_identifier: "1_3_2024-05-18",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 4,
    week_commencing: "2024-05-18",
    work_days: 3,
    unique_identifier: "2_4_2024-05-18",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 5,
    week_commencing: "2024-05-18",
    work_days: 4,
    unique_identifier: "2_5_2024-05-18",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 1,
    week_commencing: "2024-05-18",
    work_days: 3,
    unique_identifier: "2_1_2024-05-18",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 1,
    week_commencing: "2024-05-25",
    work_days: 2.5,
    unique_identifier: "1_1_2024-05-25",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 2,
    week_commencing: "2024-05-25",
    work_days: 3,
    unique_identifier: "1_2_2024-05-25",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 3,
    week_commencing: "2024-05-25",
    work_days: 4,
    unique_identifier: "1_3_2024-05-25",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 4,
    week_commencing: "2024-05-25",
    work_days: 3,
    unique_identifier: "2_4_2024-05-25",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 5,
    week_commencing: "2024-05-25",
    work_days: 4,
    unique_identifier: "2_5_2024-05-25",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 1,
    week_commencing: "2024-05-11",
    work_days: 2.5,
    unique_identifier: "1_1_2024-05-11",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 2,
    week_commencing: "2024-05-11",
    work_days: 3,
    unique_identifier: "1_2_2024-05-11",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 3,
    week_commencing: "2024-05-11",
    work_days: 4,
    unique_identifier: "1_3_2024-05-11",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 4,
    week_commencing: "2024-05-11",
    work_days: 3,
    unique_identifier: "2_4_2024-05-11",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 5,
    week_commencing: "2024-05-11",
    work_days: 4,
    unique_identifier: "2_5_2024-05-11",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 1,
    week_commencing: "2024-05-04",
    work_days: 2.5,
    unique_identifier: "1_1_2024-05-04",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 2,
    week_commencing: "2024-05-04",
    work_days: 3,
    unique_identifier: "1_2_2024-05-04",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 3,
    week_commencing: "2024-05-04",
    work_days: 4,
    unique_identifier: "1_3_2024-05-04",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 4,
    week_commencing: "2024-05-04",
    work_days: 3,
    unique_identifier: "2_4_2024-05-04",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 5,
    week_commencing: "2024-05-04",
    work_days: 4,
    unique_identifier: "2_5_2024-05-04",
  },
];

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL UNIQUE,
        delivery_manager TEXT NOT NULL,
        delivery_manager_id INTEGER NOT NULL,
        project_manager TEXT NOT NULL,
        project_manager_id INTEGER NOT NULL,
        scrum_master TEXT NOT NULL,
        scrum_master_id INTEGER NOT NULL,
        delivery_stream TEXT NOT NULL,
        value_stream TEXT NOT NULL,
        project_type TEXT NOT NULL,
        last_updated TEXT NOT NULL,
        line_of_business TEXT NOT NULL,
        task TEXT NOT NULL
    )`
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        grade TEXT NOT NULL,
        role TEXT NOT NULL
    )`
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS project_resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        project_slug TEXT NOT NULL,
        project_title TEXT NOT NULL,
        resource_id INTEGER NOT NULL,
        resource_name TEXT NOT NULL,
        rate_grade TEXT NOT NULL,
        unique_identifier TEXT NOT NULL UNIQUE
    )`
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS project_time_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        project_slug TEXT NOT NULL,
        project_title TEXT NOT NULL,
        resource_id INTEGER NOT NULL,
        week_commencing TEXT NOT NULL,
        work_days NUMBER NOT NULL,
        unique_identifier TEXT NOT NULL UNIQUE
    )`
).run();

async function initData() {
  const trackersInsert = db.prepare(`
        INSERT INTO projects VALUES (
            null,
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
            @last_updated,
            @line_of_business,
            @task
        )
    `);

  for (const project of dummyProjects) {
    trackersInsert.run(project);
  }

  const peopleInsert = db.prepare(`
  INSERT INTO people VALUES (
      null,
      @name,
      @grade,
      @role
  )
`);

  for (const person of people) {
    peopleInsert.run(person);
  }

  const projectResourcesInsert = db.prepare(`
  INSERT INTO project_resources VALUES (
      null,
      @project_id,
      @project_slug,
      @project_title,
      @resource_id,
      @resource_name,
      @rate_grade,
      @unique_identifier
  )
`);

  for (const projectResource of dummyProjectResources) {
    projectResourcesInsert.run(projectResource);
  }

  const timeEntryInsert = db.prepare(`
  INSERT INTO project_time_entries VALUES (
      null,
      @project_id,
      @project_slug,
      @project_title,
      @resource_id,
      @week_commencing,
      @work_days,
      @unique_identifier
  )
`);

  for (const time_entry of dummyHours) {
    timeEntryInsert.run(time_entry);
  }
}

initData();
