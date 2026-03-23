import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Dashboard from './pages/Dashboard.tsx'
import EntryForm from './pages/EntryForm.tsx'
import History from './pages/History.tsx'
import Nav from './components/Nav.tsx'

function Landing() {
  const [showSignIn, setShowSignIn] = useState(false)

  if (showSignIn) {
    return (
      <div className="login-page">
        <SignIn />
      </div>
    )
  }

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="nav-brand">Water Tracker</div>
        <button className="btn btn-primary" onClick={() => setShowSignIn(true)}>Sign In</button>
      </nav>
      <div className="landing-hero">
        <h1>Track Your Water Usage</h1>
        <p>Monitor daily consumption, set limits, and build better water habits — all in one place.</p>
        <div className="landing-features">
          <div className="landing-feature">
            <div className="feature-icon">+</div>
            <h3>Log Usage</h3>
            <p>Record water usage by category — drinking, cooking, washing, and more.</p>
          </div>
          <div className="landing-feature">
            <div className="feature-icon">=</div>
            <h3>Dashboard</h3>
            <p>See today's total, weekly trends, and a breakdown by category at a glance.</p>
          </div>
          <div className="landing-feature">
            <div className="feature-icon">!</div>
            <h3>Stay on Limit</h3>
            <p>Set a daily limit and get alerts when you're going over.</p>
          </div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => setShowSignIn(true)}>Get Started</button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SignedOut>
        <Landing />
      </SignedOut>
      <SignedIn>
        <Nav />
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<EntryForm />} />
            <Route path="/edit/:id" element={<EntryForm />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </SignedIn>
    </BrowserRouter>
  )
}
