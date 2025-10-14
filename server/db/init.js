import db from './connection.js';
import { createSchemaSQL } from './schema.js';
import { dbPath } from './connection.js';

try {
  db.exec(createSchemaSQL);
  console.log('Database initialized at', dbPath);
} catch (error) {
  console.error('Failed to initialize database', error);
  process.exitCode = 1;
}
