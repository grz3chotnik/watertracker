import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { getEntries } from '../utils/api.ts'
import { DAILY_LIMIT, USAGE_TYPES } from '../types/index.ts'
import type { WaterEntry } from '../types/index.ts'

export default function Dashboard() {
  const { getToken } = useAuth()
  const [entries, setEntries] = useState<WaterEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const token = await getToken()
      if (!token) return
      try {
        setEntries(await getEntries(token))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken])

  const today = new Date().toISOString().split('T')[0]
  const todayEntries = entries.filter(e => e.date === today)
  const totalToday = todayEntries.reduce((sum, e) => sum + e.amount, 0)
  const isOver = totalToday > DAILY_LIMIT

  const byCategory: Record<string, number> = {}
  for (const type of USAGE_TYPES) byCategory[type] = 0
  for (const e of todayEntries) {
    const key = USAGE_TYPES.includes(e.type) ? e.type : 'Others'
    byCategory[key] = (byCategory[key] || 0) + e.amount
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 6)
  const weekEntries = entries.filter(e => new Date(e.date) >= weekAgo)
  const weekTotal = weekEntries.reduce((sum, e) => sum + e.amount, 0)

  if (loading) return <div className="empty-state"><p>Loading...</p></div>

  return (
    <div>
      <div className="dash-header">
        <h2>Today's Overview</h2>
        <Link to="/add" className="btn btn-primary">+ Add Entry</Link>
      </div>

      <div className="stats-grid">
        <div className={`stat-card ${isOver ? 'stat-over' : ''}`}>
          <div className="stat-label">Total Today</div>
          <div className="stat-value">{totalToday}L</div>
          <div className="stat-sub">Limit: {DAILY_LIMIT}L</div>
          {isOver && (
            <div className="stat-warning">
              Over by {totalToday - DAILY_LIMIT}L
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-label">Entries Today</div>
          <div className="stat-value">{todayEntries.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Weekly Total</div>
          <div className="stat-value">{weekTotal}L</div>
          <div className="stat-sub">Last 7 days</div>
        </div>
      </div>

      {isOver && (
        <div className="alert alert-warning">
          You have exceeded your daily water usage limit of {DAILY_LIMIT}L by {totalToday - DAILY_LIMIT}L.
        </div>
      )}

      <h3>Usage by Category</h3>
      <div className="category-grid">
        {USAGE_TYPES.map(type => (
          <div key={type} className="category-card">
            <div className="cat-name">{type}</div>
            <div className="cat-amount">{byCategory[type]}L</div>
            <div className="cat-bar">
              <div
                className="cat-bar-fill"
                style={{ width: totalToday > 0 ? `${(byCategory[type] / totalToday) * 100}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {todayEntries.length > 0 && (
        <>
          <h3>Today's Entries</h3>
          <div className="entry-list">
            {todayEntries.map(e => (
              <div key={e.id} className="entry-row">
                <span className="entry-type">{e.type}</span>
                <span className="entry-amount">{e.amount}L</span>
              </div>
            ))}
          </div>
        </>
      )}

      {todayEntries.length === 0 && (
        <div className="empty-state">
          <p>No entries today. <Link to="/add">Add your first entry</Link></p>
        </div>
      )}
    </div>
  )
}
