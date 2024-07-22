const sql = require("better-sqlite3");
const db = sql("trackers.db");

const roles = [
  { role: "Delivery Lead" },
  { role: "Project Manager" },
  { role: "Developer" },
  { role: "Analyst" },
];

const resources = [
  {
    name: "Nick Fury",
    grade: "7",
    role_id: 1,
    role: "Delivery Lead",
    team: "Marvel",
    is_delivery_manager: 1,
    is_project_manager: 0,
    is_scrum_master: 0,
  },
  {
    name: "Iron Man",
    grade: "6",
    role_id: 2,
    role: "Project Manager",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 1,
    is_scrum_master: 0,
  },
  {
    name: "Captain America",
    grade: "5",
    role_id: 2,
    role: "Project Manager",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 1,
    is_scrum_master: 0,
  },
  {
    name: "Black Widow",
    grade: "4",
    role_id: 4,
    role: "Analyst",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 0,
    is_scrum_master: 1,
  },
  {
    name: "Spider Man",
    grade: "3",
    role_id: 3,
    role: "Developer",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 0,
    is_scrum_master: 1,
  },
  {
    name: "Captain Marvel",
    grade: "6",
    role_id: 1,
    role: "Delivery Lead",
    team: "Marvel",
    is_delivery_manager: 1,
    is_project_manager: 0,
    is_scrum_master: 0,
  },
  {
    name: "Thor",
    grade: "6",
    role_id: 2,
    role: "Project Manager",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 1,
    is_scrum_master: 0,
  },
  {
    name: "Loki",
    grade: "6",
    role_id: 4,
    role: "Analyst",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 0,
    is_scrum_master: 1,
  },
  {
    name: "Hulk",
    grade: "6",
    role_id: 2,
    role: "Project Manager",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 1,
    is_scrum_master: 0,
  },
  {
    name: "Hawkeye",
    grade: "3",
    role_id: 4,
    role: "Analyst",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 0,
    is_scrum_master: 0,
  },
  {
    name: "Black Panter",
    grade: "5",
    role_id: 3,
    role: "Developer",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 0,
    is_scrum_master: 1,
  },
  {
    name: "Ant Man",
    grade: "3",
    role_id: 3,
    role: "Developer",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 0,
    is_scrum_master: 1,
  },
  {
    name: "Wasp",
    grade: "3",
    role_id: 3,
    role: "Developer",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 0,
    is_scrum_master: 1,
  },
  {
    name: "Scarlet Witch",
    grade: "6",
    role_id: 2,
    role: "Project Manager",
    team: "Marvel",
    is_delivery_manager: 0,
    is_project_manager: 1,
    is_scrum_master: 0,
  },
  {
    name: "Vision",
    grade: "7",
    role_id: 1,
    role: "Delivery Lead",
    team: "Marvel",
    is_delivery_manager: 1,
    is_project_manager: 0,
    is_scrum_master: 0,
  },
  {
    name: "Dr Strange",
    grade: "6",
    role_id: 1,
    role: "Delivery Lead",
    team: "Marvel",
    is_delivery_manager: 1,
    is_project_manager: 0,
    is_scrum_master: 0,
  },
];

const dummyProjects = [
  {
    slug: "project-1",
    title: "Project 1",
    delivery_manager: "Iron Man",
    delivery_manager_id: 2,
    project_manager: "Captain America",
    project_manager_id: 3,
    scrum_master: "Spider Man",
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
    delivery_manager: "Iron Man",
    delivery_manager_id: 2,
    project_manager: "Captain America",
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
    project_manager: "Captain Marvel",
    project_manager_id: 6,
    scrum_master: "Spider Man",
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
    scrum_master: "Loki",
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
    role_id: 1,
    role: "Delivery Lead",
    rate_grade: "4",
    unique_identifier: "1_1_1_4",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 2,
    resource_name: "Iron Man",
    role_id: 2,
    role: "Project Manager",
    rate_grade: "4",
    unique_identifier: "1_2_2_4",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 3,
    resource_name: "Captain America",
    role_id: 2,
    role: "Project Manager",
    rate_grade: "5",
    unique_identifier: "1_3_2_5",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 4,
    resource_name: "Black Widow",
    role_id: 4,
    role: "Analyst",
    rate_grade: "4",
    unique_identifier: "2_4_4_4",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 5,
    resource_name: "Spider Man",
    role_id: 3,
    role: "Developer",
    rate_grade: "6",
    unique_identifier: "2_5_3_6",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 1,
    resource_name: "Nick Fury",
    role_id: 1,
    role: "Delivery Lead",
    rate_grade: "6",
    unique_identifier: "2_1_1_6",
  },
];

const dummyHours = [
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 1,
    role_id: 1,
    rate_grade: "4",
    week_commencing: "2024-05-18",
    work_days: 2.5,
    unique_identifier: "1_1_1_4_2024-05-18",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 2,
    role_id: 2,
    rate_grade: "4",
    week_commencing: "2024-05-18",
    work_days: 3,
    unique_identifier: "1_2_2_4_2024-05-18",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 3,
    role_id: 2,
    rate_grade: "5",
    week_commencing: "2024-05-18",
    work_days: 4,
    unique_identifier: "1_3_2_5_2024-05-18",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 4,
    role_id: 4,
    rate_grade: "4",
    week_commencing: "2024-05-18",
    work_days: 3,
    unique_identifier: "2_4_4_4_2024-05-18",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 5,
    role_id: 3,
    rate_grade: "6",
    week_commencing: "2024-05-18",
    work_days: 4,
    unique_identifier: "2_5_3_6_2024-05-18",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 1,
    role_id: 1,
    rate_grade: "6",
    week_commencing: "2024-05-18",
    work_days: 3,
    unique_identifier: "2_1_1_6_2024-05-18",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 1,
    role_id: 1,
    rate_grade: "4",
    week_commencing: "2024-05-25",
    work_days: 2.5,
    unique_identifier: "1_1_1_4_2024-05-25",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 2,
    role_id: 2,
    rate_grade: "4",
    week_commencing: "2024-05-25",
    work_days: 3,
    unique_identifier: "1_2_2_4_2024-05-25",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 3,
    role_id: 2,
    rate_grade: "5",
    week_commencing: "2024-05-25",
    work_days: 4,
    unique_identifier: "1_3_2_5_2024-05-25",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 4,
    role_id: 4,
    rate_grade: "4",
    week_commencing: "2024-05-25",
    work_days: 3,
    unique_identifier: "2_4_4_4_2024-05-25",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 5,
    role_id: 3,
    rate_grade: "6",
    week_commencing: "2024-05-25",
    work_days: 4,
    unique_identifier: "2_5_3_6_2024-05-25",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 1,
    role_id: 1,
    rate_grade: "4",
    week_commencing: "2024-05-11",
    work_days: 2.5,
    unique_identifier: "1_1_1_4_2024-05-11",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 2,
    role_id: 2,
    rate_grade: "4",
    week_commencing: "2024-05-11",
    work_days: 3,
    unique_identifier: "1_2_2_4_2024-05-11",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 3,
    role_id: 2,
    rate_grade: "5",
    week_commencing: "2024-05-11",
    work_days: 4,
    unique_identifier: "1_3_2_5_2024-05-11",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 4,
    role_id: 4,
    rate_grade: "4",
    week_commencing: "2024-05-11",
    work_days: 3,
    unique_identifier: "2_4_4_4_2024-05-11",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 5,
    role_id: 3,
    rate_grade: "6",
    week_commencing: "2024-05-11",
    work_days: 4,
    unique_identifier: "2_5_3_6_2024-05-11",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 1,
    role_id: 1,
    rate_grade: "4",
    week_commencing: "2024-05-04",
    work_days: 2.5,
    unique_identifier: "1_1_1_4_2024-05-04",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 2,
    role_id: 2,
    rate_grade: "4",
    week_commencing: "2024-05-04",
    work_days: 3,
    unique_identifier: "1_2_2_4_2024-05-04",
  },
  {
    project_id: 1,
    project_slug: "project-1",
    project_title: "Project 1",
    resource_id: 3,
    role_id: 2,
    rate_grade: "5",
    week_commencing: "2024-05-04",
    work_days: 4,
    unique_identifier: "1_3_2_5_2024-05-04",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 4,
    role_id: 4,
    rate_grade: "4",
    week_commencing: "2024-05-04",
    work_days: 3,
    unique_identifier: "2_4_4_4_2024-05-04",
  },
  {
    project_id: 2,
    project_slug: "project-2",
    project_title: "Project 2",
    resource_id: 5,
    role_id: 3,
    rate_grade: "6",
    week_commencing: "2024-05-04",
    work_days: 4,
    unique_identifier: "2_5_3_6_2024-05-04",
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
    CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        grade TEXT NOT NULL,
        role_id NUMBER NOT NULL,
        role TEXT NOT NULL,
        team TEXT NOT NULL,
        is_delivery_manager NUMBER NOT NULL,
        is_project_manager NUMBER NOT NULL,
        is_scrum_master NUMBER NOT NULL
    )`
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL UNIQUE
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
        role_id INTEGER NOT NULL,
        role TEXT NOT NULL,
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
        role_id INTEGER NOT NULL,
        rate_grade TEXT NOT NULL,
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

  const resourcesInsert = db.prepare(`
  INSERT INTO resources VALUES (
      null,
      @name,
      @grade,
      @role_id,
      @role,
      @team,
      @is_delivery_manager,
      @is_project_manager,
      @is_scrum_master
  )
`);

  for (const resource of resources) {
    resourcesInsert.run(resource);
  }

  const rolesInsert = db.prepare(`
    INSERT INTO roles VALUES (
        null,
        @role
    )
  `);

  for (const role of roles) {
    rolesInsert.run(role);
  }

  const projectResourcesInsert = db.prepare(`
  INSERT INTO project_resources VALUES (
      null,
      @project_id,
      @project_slug,
      @project_title,
      @resource_id,
      @resource_name,
      @role_id,
      @role,
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
      @role_id,
      @rate_grade,
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
