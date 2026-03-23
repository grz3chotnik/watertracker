import { Router, Response } from 'express'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { requireAuth, AuthRequest } from '../middleware/auth.js'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool as any)

const router = Router()
const prisma = new PrismaClient({ adapter })

router.use(requireAuth)

async function ensureUser(userId: string) {
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: '' },
  })
}

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    await ensureUser(req.userId!)
    const entries = await prisma.waterEntry.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    })
    res.json(entries)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/today', async (req: AuthRequest, res: Response) => {
  try {
    await ensureUser(req.userId!)
    const today = new Date().toISOString().split('T')[0]
    const entries = await prisma.waterEntry.findMany({
      where: { userId: req.userId, date: today },
    })
    res.json(entries)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    await ensureUser(req.userId!)
    const { date, amount, type } = req.body

    if (!date) {
      res.status(400).json({ error: 'Date is required' })
      return
    }
    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Amount must be a positive number' })
      return
    }
    if (!type) {
      res.status(400).json({ error: 'Usage type is required' })
      return
    }

    const entry = await prisma.waterEntry.create({
      data: { date, amount, type, userId: req.userId! },
    })
    res.status(201).json(entry)
  } catch (err) {
    console.error('Create entry error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const { date, amount, type } = req.body

    const existing = await prisma.waterEntry.findUnique({ where: { id } })
    if (!existing || existing.userId !== req.userId) {
      res.status(404).json({ error: 'Entry not found' })
      return
    }

    const entry = await prisma.waterEntry.update({
      where: { id },
      data: { date, amount, type },
    })
    res.json(entry)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string

    const existing = await prisma.waterEntry.findUnique({ where: { id } })
    if (!existing || existing.userId !== req.userId) {
      res.status(404).json({ error: 'Entry not found' })
      return
    }

    await prisma.waterEntry.delete({ where: { id } })
    res.json({ message: 'Deleted' })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
