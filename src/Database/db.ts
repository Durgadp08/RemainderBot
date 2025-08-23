import Database from "better-sqlite3";
import path from "path";

const dbpath = path.resolve(__dirname, "./task.db");

console.log(dbpath);

const db = new Database(dbpath, { verbose: console.log });

let sqlUsers = `
    Create Table if not exists users(
        id INTEGER PRIMARY KEY,
        remoteid TEXT NOT NULL
    )
`;
let sqlTasks = `
    Create Table if not exists tasks(
        id INTEGER PRIMARY KEY,
        ownerid INT,
        task TEXT,
        recurrence TEXT,
        due TEXT,
        status TEXT
    )
`;
let sqlDeadline = `
    Create Table if not exists messages(
        id INTEGER PRIMARY KEY,
        task_id INT,
        message TEXT
    )
`;


export default db;
