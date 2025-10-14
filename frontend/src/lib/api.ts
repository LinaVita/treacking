export type Habit = { id: number; name: string; color: string; created_at: string };
export type Checkin = { date: string; value: number };

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchHabits(): Promise<Habit[]> {
  const res = await fetch(`${API_BASE}/habits`);
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
}

export async function createHabit(habit: { name: string; color?: string }): Promise<Habit> {
  const res = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit),
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
}

export async function deleteHabit(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/habits/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete habit');
}

export async function listCheckins(habitId: number, range?: { start?: string; end?: string }): Promise<Checkin[]> {
  const params = new URLSearchParams({
    habitId: String(habitId),
    ...(range?.start ? { start: range.start } : {}),
    ...(range?.end ? { end: range.end } : {}),
  });
  const res = await fetch(`${API_BASE}/checkins?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch checkins');
  return res.json();
}

export async function toggleCheckin(habitId: number, date: string, value?: number): Promise<Checkin> {
  const res = await fetch(`${API_BASE}/checkins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habitId, date, value }),
  });
  if (!res.ok) throw new Error('Failed to update checkin');
  return res.json();
}
