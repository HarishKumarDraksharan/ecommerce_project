import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-dark-400 flex-wrap">
      <Link to="/home" className="hover:text-primary-500 transition-colors flex items-center gap-1">
        <Home size={14} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={13} className="text-dark-300" />
          {item.href ? (
            <Link to={item.href} className="hover:text-primary-500 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-dark-700 dark:text-dark-200 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
