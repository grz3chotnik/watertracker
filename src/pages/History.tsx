import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { getEntries, deleteEntry } from '../utils/api.ts'
import type { WaterEntry } from '../types/index.ts'

export default function History() {
  const { getToken } = useAuth()
  const [entries, setEntries] = useState<WaterEntry[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => { load() }, [getToken])

  async function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return
    const token = await getToken()
    if (!token) return
    await deleteEntry(token, id)
    await load()
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))

  if (loading) return <div className="empty-state"><p>Loading...</p></div>

  return (
    <div>
      <h2>Usage History</h2>
      {sorted.length === 0 && (
        <div className="empty-state">
          <p>No entries yet. <Link to="/add">Add your first entry</Link></p>
        </div>
      )}
      {sorted.length > 0 && (
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(e => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td>{e.type}</td>
                <td>{e.amount}L</td>
                <td className="action-cell">
                  <Link to={`/edit/${e.id}`} className="btn btn-sm">Edit</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
