import db from './connection.js';
import { createSchemaSQL, dropSchemaSQL } from './schema.js';

try {
  db.exec(dropSchemaSQL);
  db.exec(createSchemaSQL);
  console.log('Database reset complete.');
} catch (error) {
  console.error('Failed to reset database', error);
  process.exitCode = 1;
}
