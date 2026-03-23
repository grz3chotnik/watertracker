import { Link, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'

export default function Nav() {
  const location = useLocation()

  function isActive(path: string) {
    return location.pathname === path ? 'nav-link active' : 'nav-link'
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">Water Tracker</div>
      <div className="nav-links">
        <Link to="/" className={isActive('/')}>Dashboard</Link>
        <Link to="/add" className={isActive('/add')}>Add Entry</Link>
        <Link to="/history" className={isActive('/history')}>History</Link>
      </div>
      <div className="nav-user">
        <UserButton />
      </div>
    </nav>
  )
}
