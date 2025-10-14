export const createSchemaSQL = `
CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(length(name) <= 100),
  color TEXT NOT NULL DEFAULT '#22c55e',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 1,
  UNIQUE(habit_id, date),
  FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_checkins_habit_date ON checkins(habit_id, date);
`;

export const dropSchemaSQL = `
DROP TABLE IF EXISTS checkins;
DROP TABLE IF EXISTS habits;
`;
