import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { clerkAuth } from './middleware/auth.js'
import entryRoutes from './routes/entries.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['https://watertracker-liard.vercel.app', 'http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())
app.use(clerkAuth)

app.use('/api/entries', entryRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
