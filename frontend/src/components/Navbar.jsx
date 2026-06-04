import { ActivitySquare } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700',
  ].join(' ')

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <ActivitySquare className="h-6 w-6" />
          </span>
          <div>
            <p className="title-display text-lg font-bold text-slate-950 sm:text-xl">AI Customer Churn</p>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Prediction Dashboard</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navLinkClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            History
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
