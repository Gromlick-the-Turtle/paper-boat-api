import Database from 'better-sqlite3';
import fs from 'node:fs';

const db = new Database('dev.sqlite');

const query = fs.readFileSync('src/config/dev-schema.sql', 'utf8');

db.exec(query);

export default db;