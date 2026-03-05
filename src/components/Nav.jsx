import { useState } from 'react'
import { S, COLORS, FONTS } from '../theme'

const NAV_ITEMS = [
  { id: 'home',      label: '~/home' },
  { id: 'blog',      label: '~/blog' },
  { id: 'about',     label: '~/about' },
  { id: 'resources', label: '~/resources' },
]

export default function Nav({ page, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavigate = (id) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  return (
    <nav style={S.nav}>
      <div style={S.navInner}>
        {/* Logo */}
        <div style={S.logo} onClick={() => handleNavigate('home')} title="Mystik">
          <div style={S.logoDot} />
          Mystik
        </div>

        {/* Desktop nav links */}
        <div className="nav-links">
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className="nav-link-item"
              style={S.navLink(page === item.id)}
              onClick={() => handleNavigate(item.id)}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`nav-mobile-item${page === item.id ? ' active' : ''}`}
            onClick={() => handleNavigate(item.id)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </nav>
  )
}
