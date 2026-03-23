import type { WaterEntry } from '../types/index.ts'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request(path: string, token: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Request failed')
  }
  return res.json()
}

export async function getEntries(token: string): Promise<WaterEntry[]> {
  return request('/entries', token)
}

export async function getTodayEntries(token: string): Promise<WaterEntry[]> {
  return request('/entries/today', token)
}

export async function createEntry(token: string, data: { date: string; amount: number; type: string }): Promise<WaterEntry> {
  return request('/entries', token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateEntry(token: string, id: string, data: { date: string; amount: number; type: string }): Promise<WaterEntry> {
  return request(`/entries/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteEntry(token: string, id: string): Promise<void> {
  return request(`/entries/${id}`, token, {
    method: 'DELETE',
  })
}
