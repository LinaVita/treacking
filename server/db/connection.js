import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const dbPath = path.join(process.cwd(), 'data', 'habits.sqlite');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
// Ensure reasonable defaults
// Enable write-ahead logging and foreign keys
try {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
} catch (error) {
  console.error('Failed to set PRAGMAs on SQLite database', error);
}

export default db;
export { dbPath };
