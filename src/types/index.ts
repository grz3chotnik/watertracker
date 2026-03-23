export interface User {
  email: string
  password: string
}

export interface WaterEntry {
  id: string
  date: string
  amount: number
  type: UsageType
}

export type UsageType = 'Drinking' | 'Cooking' | 'Washing' | 'Bathing' | 'Others'

export const USAGE_TYPES: UsageType[] = ['Drinking', 'Cooking', 'Washing', 'Bathing', 'Others']
export const DAILY_LIMIT = 150
