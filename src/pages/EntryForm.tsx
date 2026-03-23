import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { getEntries, createEntry, updateEntry } from '../utils/api.ts'
import { USAGE_TYPES } from '../types/index.ts'
import type { UsageType } from '../types/index.ts'

export default function EntryForm() {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<UsageType>('Drinking')
  const [customType, setCustomType] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    async function load() {
      const token = await getToken()
      if (!token) return
      const entries = await getEntries(token)
      const entry = entries.find(e => e.id === id)
      if (entry) {
        setDate(entry.date)
        setAmount(String(entry.amount))
        if (USAGE_TYPES.includes(entry.type)) {
          setType(entry.type)
        } else {
          setType('Others')
          setCustomType(entry.type)
        }
      }
    }
    load()
  }, [id, getToken])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!date) {
      setError('Date is required')
      return
    }
    const numAmount = parseFloat(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a positive number')
      return
    }

    const finalType = type === 'Others' && customType.trim() ? customType.trim() : type

    const token = await getToken()
    if (!token) return

    try {
      if (isEdit) {
        await updateEntry(token, id!, { date, amount: numAmount, type: finalType })
      } else {
        await createEntry(token, { date, amount: numAmount, type: finalType })
      }
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
  }

  return (
    <div className="form-page">
      <h2>{isEdit ? 'Edit Entry' : 'Add Water Usage'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="entry-form">
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Amount (liters)</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="form-group">
          <label>Usage Type</label>
          <select value={type} onChange={e => setType(e.target.value as UsageType)}>
            {USAGE_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        {type === 'Others' && (
          <div className="form-group">
            <label>Custom Type</label>
            <input
              type="text"
              value={customType}
              onChange={e => setCustomType(e.target.value)}
              placeholder="e.g. Gardening"
            />
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update' : 'Add Entry'}
          </button>
          <button type="button" className="btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
