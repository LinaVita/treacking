import { useEffect, useMemo, useState } from 'react'
import './index.css'
import { createHabit, deleteHabit, fetchHabits, listCheckins, toggleCheckin, type Habit } from './lib/api'

function Header() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <span className="btn btn-ghost text-xl">Habit Tracker</span>
      </div>
      <div className="flex-none">
        <label className="swap swap-rotate">
          {/* this toggle is non-functional placeholder for theme switching */}
          <input type="checkbox" />
          <svg className="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64 17.657A9 9 0 0018.36 4.93a9 9 0 11-12.72 12.728z"/></svg>
          <svg className="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12a7 7 0 1014 0 7 7 0 00-14 0zm7-9a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm0 18a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4 11a1 1 0 000 2H3a1 1 0 110-2h1zm18 0a1 1 0 000 2h-1a1 1 0 110-2h1zM7.05 5.636a1 1 0 011.414 0L9.9 7.071a1 1 0 01-1.414 1.415L7.05 7.05a1 1 0 010-1.414zm9.9 9.9a1 1 0 011.414 0l1.435 1.435a1 1 0 11-1.414 1.414l-1.435-1.435a1 1 0 010-1.414zM5.636 16.95a1 1 0 010 1.414L4.2 19.8a1 1 0 11-1.414-1.414l1.435-1.435a1 1 0 011.414 0zM18.364 7.05a1 1 0 010-1.414L19.8 4.2A1 1 0 1121.214 5.636L19.78 7.07a1 1 0 01-1.415-1.414z"/></svg>
        </label>
      </div>
    </div>
  )
}

function HabitForm({ onCreated }: { onCreated(h: Habit): void }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#22c55e')
  const canSubmit = name.trim().length > 0
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    const habit = await createHabit({ name: name.trim(), color })
    setName('')
    onCreated(habit)
  }
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="input input-bordered w-full"
        placeholder="Нова звичка..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input type="color" className="input w-16 h-10 p-1" value={color} onChange={e => setColor(e.target.value)} />
      <button disabled={!canSubmit} className="btn btn-primary">Додати</button>
    </form>
  )
}

function HabitRow({ habit, onDeleted }: { habit: Habit, onDeleted(id: number): void }) {
  const [todayChecked, setTodayChecked] = useState(false)
  const today = useMemo(() => new Date().toISOString().slice(0,10), [])
  useEffect(() => {
    listCheckins(habit.id, { start: today, end: today }).then(rows => {
      setTodayChecked(!!rows[0]?.value)
    }).catch(() => {})
  }, [habit.id, today])

  const toggle = async () => {
    const next = !todayChecked
    setTodayChecked(next)
    try {
      await toggleCheckin(habit.id, today, next ? 1 : 0)
    } catch (e) {
      setTodayChecked(!next)
    }
  }
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 bg-base-200">
      <div className="flex items-center gap-3">
        <div className="w-3 h-10 rounded" style={{ backgroundColor: habit.color }} />
        <div>
          <div className="font-medium">{habit.name}</div>
          <div className="text-xs opacity-60">створено {new Date(habit.created_at).toLocaleDateString()}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" className="toggle toggle-success" checked={todayChecked} onChange={toggle} />
        <button className="btn btn-ghost btn-sm" onClick={() => onDeleted(habit.id)}>Видалити</button>
      </div>
    </div>
  )
}

function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHabits().then(setHabits).catch(err => setError(String(err))).finally(() => setLoading(false))
  }, [])

  const onCreated = (h: Habit) => setHabits(prev => [h, ...prev])
  const onDeleted = async (id: number) => {
    const prev = habits
    setHabits(habits.filter(h => h.id !== id))
    try {
      await deleteHabit(id)
    } catch {
      setHabits(prev)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Додати звичку</h2>
            <HabitForm onCreated={onCreated} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Мої звички</h2>
          <span className="badge badge-outline">{habits.length}</span>
        </div>

        {loading && <div className="loading loading-spinner loading-lg" />}
        {error && <div className="alert alert-error">{error}</div>}
        <div className="grid gap-3">
          {habits.map(h => (
            <HabitRow key={h.id} habit={h} onDeleted={onDeleted} />
          ))}
          {!loading && habits.length === 0 && (
            <div className="text-center opacity-70">Почніть з додавання нової звички</div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
